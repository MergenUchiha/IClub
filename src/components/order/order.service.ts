import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    CreateOrderDto,
    OrderResponseSchema,
    OrdersResponseSchema,
    TApiOrderResponse,
    TApiOrdersResponse,
} from 'src/libs/contracts';
import { UserTokenDto } from '../token/dto/userToken.dto';
import {
    UserNotFoundException,
    OrderNotFoundException,
    OrderConflictException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async placeAnOrder(
        currentUser: UserTokenDto,
        dto: CreateOrderDto,
    ): Promise<TApiResp<TApiOrderResponse>> {
        const user = await this.findUserById(currentUser.id);
        try {
            const total = dto.orderItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0,
            );

            if (dto.orderItems.length === 0) {
                throw new OrderConflictException();
            }

            const order = await this.prisma.$transaction(async (prisma) => {
                const createdOrder = await prisma.order.create({
                    data: {
                        status: 'PENDING', // Use dto.status or default to PENDING
                        totalPrice: total,
                        userId: user.id,
                    },
                    include: { orderItems: true },
                });

                const orderItems = await Promise.all(
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

                return {
                    ...createdOrder,
                    orderItems,
                };
            });

            const parsed = OrderResponseSchema.parse(order);
            return { good: true, response: parsed };
        } catch {
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
        if (order.status === 'VERIFIED') {
            throw new OrderConflictException();
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
        return {
            good: true,
        };
    }

    async updateOrder(orderId: string): Promise<TApiResp<true>> {
        const order = await this.findOrderById(orderId);
        if (order.status === 'CANCELLED') {
            throw new OrderConflictException();
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'VERIFIED',
            },
        });
        return {
            good: true,
        };
    }

    async getOneOrder(orderId: string): Promise<TApiResp<TApiOrderResponse>> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true },
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
            include: { orderItems: true },
        });
        if (!order) {
            throw new OrderNotFoundException();
        }

        const parsed = OrderResponseSchema.parse(order);
        return { good: true, response: parsed };
    }

    async getOrders(): Promise<TApiResp<TApiOrdersResponse>> {
        const orders = await this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: {
                    include: {
                        product: { select: { name: true } },
                    },
                },
            },
        });
        const parsed = OrdersResponseSchema.parse(orders);
        return {
            good: true,
            response: parsed,
        };
    }

    async getMyOrders(
        currentUser: UserTokenDto,
    ): Promise<TApiResp<TApiOrdersResponse>> {
        const user = await this.findUserById(currentUser.id);
        const orders = await this.prisma.order.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: {
                    include: {
                        product: { select: { name: true } },
                    },
                },
            },
        });
        const parsed = OrdersResponseSchema.parse(orders);
        return {
            good: true,
            response: parsed,
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
