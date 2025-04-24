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
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { CreateBookingOperation } from './decorator/createBookingOperation.decorator';
import { AddToExistingBookingOperation } from './decorator/addToExistingBookingOperation.decorator';
import { UpdateBookingDetailOperation } from './decorator/updateBookingDetailOperation.decorator';
import { GetAllBookingsOperation } from './decorator/getAllBookingsOperation.decorator';
import { GetOneBookingOperation } from './decorator/getOneBookingOperation.decorator';
import { DeleteBookingDetailOperation } from './decorator/deleteBookingDetailOperation.decorator';

@ADMIN()
@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @CreateBookingOperation()
    @HttpCode(HttpStatus.OK)
    @Post()
    async createBooking(
        @Body() dto: CreateBookingDto,
    ): Promise<TApiResp<TApiBookingResponse>> {
        return this.bookingService.createBooking(dto);
    }

    @AddToExistingBookingOperation()
    @HttpCode(HttpStatus.OK)
    @Post(':bookingId/details')
    async addToExistingBooking(
        @Param('bookingId') bookingId: string,
        @Body() dto: AddBookingDetailDto,
    ): Promise<TApiResp<TApiBookingResponse>> {
        return this.bookingService.addToExistingBooking(bookingId, dto);
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

    @GetAllBookingsOperation()
    @HttpCode(HttpStatus.OK)
    @Get()
    async getAllBookings(): Promise<TApiResp<TApiBookingsResponse>> {
        return this.bookingService.getAllBookings();
    }

    @GetOneBookingOperation()
    @Get(':bookingId')
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
}
