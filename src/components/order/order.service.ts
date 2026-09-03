import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    CreateOrderDto,
    OrderResponseSchema,
    OrdersResponseSchema,
    PageDto,
    TApiOrderResponse,
    TApiOrdersResponse,
    UpdateOrderDto,
} from 'src/libs/contracts';
import { UserTokenDto } from '../token/dto/userToken.dto';
import {
    UserNotFoundException,
    OrderNotFoundException,
    OrderConflictException,
    OrderCancelConflictException,
    OrderUpdateConflictException,
    OrderCompleteConflictException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(private prisma: PrismaService) {}

    async placeAnOrder(
        currentUser: UserTokenDto,
        dto: CreateOrderDto,
    ): Promise<TApiResp<TApiOrderResponse>> {
        const user = await this.findUserById(currentUser.id);

        if (dto.orderItems.length === 0) {
            throw new OrderConflictException();
        }

        const total = dto.orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        );

        // Only the transaction itself is guarded. Wrapping the whole method
        // used to turn every failure - a bad product id, a database outage -
        // into the same "order conflict" response.
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const createdOrder = await prisma.order.create({
                    data: {
                        status: 'PENDING',
                        totalPrice: total,
                        description: dto.description,
                        userId: user.id,
                    },
                });

                await Promise.all(
                    dto.orderItems.map((item) =>
                        prisma.orderItem.create({
                            data: {
                                orderId: createdOrder.id,
                                price: item.price,
                                quantity: item.quantity,
                                productId: item.productId,
                            },
                        }),
                    ),
                );
                const order = await prisma.order.findUnique({
                    where: { id: createdOrder.id },
                    include: {
                        orderItems: {
                            include: { product: { select: { name: true } } },
                        },
                        user: true,
                    },
                });
                const parsed = OrderResponseSchema.parse(order);
                return { good: true, response: parsed };
            });
        } catch (error) {
            this.logger.error(
                `Failed to place an order for user ${user.id}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw new OrderConflictException();
        }
    }

    async cancelOrder(
        currentUser: UserTokenDto,
        orderId: string,
    ): Promise<TApiResp<true>> {
        await this.findUserById(currentUser.id);

        const order = await this.findOrderById(orderId);

        if (order.userId !== currentUser.id) {
            throw new UnauthorizedException(
                'Unauthorized: You can only cancel your own orders',
            );
        }
        if (order.status === 'VERIFIED' || order.status === 'COMPLETED') {
            throw new OrderCancelConflictException();
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
        return {
            good: true,
        };
    }

    async cancelOrderByAdmin(orderId: string): Promise<TApiResp<true>> {
        const order = await this.findOrderById(orderId);
        if (order.status === 'COMPLETED') {
            throw new OrderCancelConflictException();
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
        return {
            good: true,
        };
    }

    async completeOrder(orderId: string): Promise<TApiResp<true>> {
        const order = await this.findOrderById(orderId);
        if (
            order.status === 'COMPLETED' ||
            order.status === 'CANCELLED' ||
            order.status === 'PENDING'
        ) {
            throw new OrderCompleteConflictException();
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'COMPLETED' },
        });
        return {
            good: true,
        };
    }

    async updateOrder(
        orderId: string,
        dto: UpdateOrderDto,
    ): Promise<TApiResp<true>> {
        const order = await this.findOrderById(orderId);
        if (
            order.status === 'CANCELLED' ||
            order.status === 'VERIFIED' ||
            order.status === 'COMPLETED'
        ) {
            throw new OrderUpdateConflictException();
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                description: dto.description,
                status: dto.status,
            },
        });
        return {
            good: true,
        };
    }

    async getOneOrder(orderId: string): Promise<TApiResp<TApiOrderResponse>> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true, user: true },
        });
        if (!order) {
            throw new OrderNotFoundException();
        }
        const parsed = OrderResponseSchema.parse(order);
        return { good: true, response: parsed };
    }

    async getMyOneOrder(
        currentUser: UserTokenDto,
        orderId: string,
    ): Promise<TApiResp<TApiOrderResponse>> {
        const user = await this.findUserById(currentUser.id);

        const order = await this.prisma.order.findUnique({
            where: { id: orderId, userId: user.id },
            include: { orderItems: true, user: true },
        });
        if (!order) {
            throw new OrderNotFoundException();
        }

        const parsed = OrderResponseSchema.parse(order);
        return { good: true, response: parsed };
    }

    async getOrders(query: PageDto): Promise<TApiResp<TApiOrdersResponse>> {
        const { page = 1, take = 5, order = 'desc' } = query;
        const orders = await this.prisma.order.findMany({
            orderBy: { createdAt: order },
            take,
            skip: (page - 1) * take,
            include: {
                orderItems: {
                    include: {
                        product: { select: { name: true } },
                    },
                },
                user: true,
            },
        });
        const count = await this.prisma.order.count();
        const parsed = OrdersResponseSchema.parse(orders);
        return {
            good: true,
            response: parsed,
            count: count,
        };
    }

    async getMyOrders(
        currentUser: UserTokenDto,
        query: PageDto,
    ): Promise<TApiResp<TApiOrdersResponse>> {
        const { page = 1, take = 5, order = 'desc' } = query;
        const user = await this.findUserById(currentUser.id);
        const where = { userId: user.id };
        const orders = await this.prisma.order.findMany({
            where,
            orderBy: { createdAt: order },
            take,
            skip: (page - 1) * take,
            include: {
                orderItems: {
                    include: {
                        product: { select: { name: true } },
                    },
                },
                user: true,
            },
        });
        // Used to return the total number of orders in the system, which made
        // the page count wrong for every user.
        const count = await this.prisma.order.count({ where });
        const parsed = OrdersResponseSchema.parse(orders);
        return {
            good: true,
            response: parsed,
            count: count,
        };
    }

    private async findUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    private async findOrderById(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new OrderNotFoundException();
        }

        return order;
    }
}
