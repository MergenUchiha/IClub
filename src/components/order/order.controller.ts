import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from 'src/libs/contracts';
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

    @UpdateOrderOperation()
    @Patch(':id/verify')
    async updateOrder(@Param('id') orderId: string): Promise<TApiResp<true>> {
        return this.orderService.updateOrder(orderId);
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
    async getOrders(): Promise<TApiResp<TApiOrdersResponse>> {
        return this.orderService.getOrders();
    }

    @GetMyOrdersOperation()
    @Get('my')
    async getMyOrders(
        @CurrentUser() user: UserTokenDto,
    ): Promise<TApiResp<TApiOrdersResponse>> {
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.orderService.getMyOrders(user);
    }
}
