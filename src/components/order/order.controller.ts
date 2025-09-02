import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, PageDto, UpdateOrderDto } from 'src/libs/contracts';
import { UserTokenDto } from '../token/dto/userToken.dto';
import { TApiOrderResponse, TApiOrdersResponse } from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { PlaceAnOrderOperation } from './decorator/placeAnOrderOperation.decorator';
import { CancelOrderOperation } from './decorator/cancelOrderOperation.decorator';
import { UpdateOrderOperation } from './decorator/updateOrderOperation.decorator';
import { GetOneOrderOperation } from './decorator/getOneOrderOperation.decorator';
import { GetMyOneOrderOperation } from './decorator/getMyOneOrderOperation.decorator';
import { GetMyOrdersOperation } from './decorator/getMyOrdersOperation.decorator';
import { GetOrdersOperation } from './decorator/getOrdersOperation.decorator';
import { CancelOrderByAdminOperation } from './decorator/cancelOrderByAdminOperation.decorator';
import { CompleteOrderOperation } from './decorator/completeOrderOperation.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @PlaceAnOrderOperation()
    @Post()
    async placeAnOrder(
        @CurrentUser() user: UserTokenDto,
        @Body() dto: CreateOrderDto,
    ): Promise<TApiResp<TApiOrderResponse>> {
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.orderService.placeAnOrder(user, dto);
    }

    @CancelOrderOperation()
    @Patch(':id/cancel')
    async cancelOrder(
        @CurrentUser() user: UserTokenDto,
        @Param('id') orderId: string,
    ): Promise<TApiResp<true>> {
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.orderService.cancelOrder(user, orderId);
    }

    @CancelOrderByAdminOperation()
    @Patch('admin/:id/cancel')
    async cancelOrderByAdmin(
        @Param('id') orderId: string,
    ): Promise<TApiResp<true>> {
        return this.orderService.cancelOrderByAdmin(orderId);
    }

    @CompleteOrderOperation()
    @Patch('admin/:id/complete')
    async completeOrder(@Param('id') orderId: string): Promise<TApiResp<true>> {
        return this.orderService.completeOrder(orderId);
    }

    @UpdateOrderOperation()
    @Patch(':id')
    async updateOrder(
        @Param('id') orderId: string,
        @Body() dto: UpdateOrderDto,
    ): Promise<TApiResp<true>> {
        return this.orderService.updateOrder(orderId, dto);
    }

    @GetOneOrderOperation()
    @Get(':id')
    async getOneOrder(
        @Param('id') orderId: string,
    ): Promise<TApiResp<TApiOrderResponse>> {
        return this.orderService.getOneOrder(orderId);
    }

    @GetMyOneOrderOperation()
    @Get('my/:orderId')
    async getMyOneOrder(
        @CurrentUser() user: UserTokenDto,
        @Param('orderId') orderId: string,
    ): Promise<TApiResp<TApiOrderResponse>> {
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.orderService.getMyOneOrder(user, orderId);
    }

    @GetOrdersOperation()
    @Get()
    async getOrders(
        @Query() query: PageDto,
    ): Promise<TApiResp<TApiOrdersResponse>> {
        return this.orderService.getOrders(query);
    }

    @GetMyOrdersOperation()
    @Get('my')
    async getMyOrders(
        @CurrentUser() user: UserTokenDto,
        @Query() query: PageDto,
    ): Promise<TApiResp<TApiOrdersResponse>> {
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.orderService.getMyOrders(user, query);
    }
}
