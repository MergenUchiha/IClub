import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import {
    AddBookingDetailDto,
    CreateBookingDto,
    UpdateBookingDetailDto,
    TApiBookingResponse,
    TApiBookingsResponse,
    TApiDetailResponse,
    TApiDetailsResponse,
    GetBookingByDateDto,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { CreateBookingOperation } from './decorator/createBookingOperation.decorator';
import { AddToExistingBookingOperation } from './decorator/addToExistingBookingOperation.decorator';
import { UpdateBookingDetailOperation } from './decorator/updateBookingDetailOperation.decorator';
import {
    GetAllBookingsForAdminOperation,
    GetAllBookingsOperation,
} from './decorator/getAllBookingsOperation.decorator';
import { GetOneBookingOperation } from './decorator/getOneBookingOperation.decorator';
import { DeleteBookingDetailOperation } from './decorator/deleteBookingDetailOperation.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UserTokenDto } from '../token/dto/userToken.dto';
import { GetMyBookingOperation } from './decorator/getMyBookingOperation.decorator';
import { GetBookingByDateOperation } from './decorator/getBookingByDateOperation.decorator';
import { DeleteBookingDetailByAdminOperation } from './decorator/deleteBookingDetailByAdminOperation.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @GetBookingByDateOperation()
    @HttpCode(HttpStatus.OK)
    @Post('date')
    async getBookingByDate(
        @Body() dto: GetBookingByDateDto,
    ): Promise<TApiResp<TApiBookingResponse>> {
        return await this.bookingService.getBookingByDate(dto);
    }

    @CreateBookingOperation()
    @HttpCode(HttpStatus.OK)
    @Post()
    async createBooking(
        @Body() dto: CreateBookingDto,
        @CurrentUser() user: UserTokenDto,
    ): Promise<TApiResp<TApiBookingResponse>> {
        return this.bookingService.createBooking(dto, user.id);
    }

    @AddToExistingBookingOperation()
    @HttpCode(HttpStatus.OK)
    @Post(':bookingId/details')
    async addToExistingBooking(
        @Param('bookingId') bookingId: string,
        @Body() dto: AddBookingDetailDto,
        @CurrentUser() user: UserTokenDto,
    ): Promise<TApiResp<TApiBookingResponse>> {
        return this.bookingService.addToExistingBooking(
            bookingId,
            user.id,
            dto,
        );
    }

    @UpdateBookingDetailOperation()
    @HttpCode(HttpStatus.OK)
    @Patch(':bookingId/details/:detailId')
    async updateBookingDetail(
        @Param('detailId') detailId: string,
        @Body() dto: UpdateBookingDetailDto,
    ): Promise<TApiResp<TApiDetailResponse>> {
        return this.bookingService.updateBookingDetail(detailId, dto);
    }

    @GetAllBookingsForAdminOperation()
    @HttpCode(HttpStatus.OK)
    @Get('/admin')
    async getAllBookingsForAdmin(): Promise<TApiResp<TApiBookingsResponse>> {
        return this.bookingService.getAllBookings();
    }

    @GetAllBookingsOperation()
    @HttpCode(HttpStatus.OK)
    @Get()
    async getAllBookings(): Promise<TApiResp<TApiBookingsResponse>> {
        return this.bookingService.getAllBookings();
    }

    @GetMyBookingOperation()
    @HttpCode(HttpStatus.OK)
    @Get('/details/my')
    async getMyBooking(
        @CurrentUser() user: UserTokenDto,
    ): Promise<TApiResp<TApiDetailsResponse>> {
        return this.bookingService.getMyBooking(user.id);
    }

    @GetOneBookingOperation()
    @Get('admin/:bookingId')
    @HttpCode(HttpStatus.OK)
    async getOneBooking(
        @Param('bookingId') bookingId: string,
    ): Promise<TApiResp<TApiBookingResponse>> {
        return this.bookingService.getOneBooking(bookingId);
    }

    @DeleteBookingDetailOperation()
    @HttpCode(HttpStatus.OK)
    @Delete(':bookingId/details/:detailId')
    async deleteBookingDetail(
        @Param('detailId') detailId: string,
    ): Promise<TApiResp<true>> {
        return this.bookingService.deleteBookingDetail(detailId);
    }

    @DeleteBookingDetailByAdminOperation()
    @HttpCode(HttpStatus.OK)
    @Delete('admin/:bookingId/details/:detailId')
    async deleteBookingDetailByAdmin(
        @Param('detailId') detailId: string,
    ): Promise<TApiResp<true>> {
        return this.bookingService.deleteBookingDetail(detailId);
    }
}
