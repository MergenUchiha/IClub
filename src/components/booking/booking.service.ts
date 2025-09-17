import { Injectable } from '@nestjs/common';
import {
    AddBookingDetailDto,
    BookingResponseSchema,
    BookingsResponseSchema,
    CreateBookingDto,
    DetailResponseSchema,
    GetBookingByDateDto,
    MyDetailsResponseSchema,
    TApiBookingResponse,
    TApiBookingsResponse,
    TApiDetailResponse,
    TApiMyDetailsResponse,
    UpdateBookingDetailDto,
} from 'src/libs/contracts';
import {
    BookingDateExistenceException,
    BookingDetailNotFoundException,
    BookingNotFoundException,
    LessonExistingConflictException,
    UserNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
    constructor(private prisma: PrismaService) {}

    async getBookingByDate(
        dto: GetBookingByDateDto,
    ): Promise<TApiResp<TApiBookingResponse>> {
        const booking = await this.prisma.booking.findUnique({
            where: { bookingDate: dto.bookingDate },
            include: {
                details: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new BookingNotFoundException();
        }
        const parsed = BookingResponseSchema.parse(booking);
        return {
            good: true,
            response: parsed,
        };
    }

    async createBooking(
        dto: CreateBookingDto,
        userId: string,
    ): Promise<TApiResp<TApiBookingResponse>> {
        await this.isBookingDateExist(dto.bookingDate);
        await this.findUserById(userId);
        const booking = await this.prisma.booking.create({
            data: {
                bookingDate: dto.bookingDate,
                details: {
                    create: {
                        lesson: dto.details.lesson,
                        tv: dto.details.tv,
                        userId: userId,
                    },
                },
            },
            include: { details: { include: { user: true } } },
        });
        const parsed = BookingResponseSchema.parse(booking);
        return {
            good: true,
            response: parsed,
        };
    }

    async addToExistingBooking(
        bookingId: string,
        userId: string,
        dto: AddBookingDetailDto,
    ): Promise<TApiResp<TApiBookingResponse>> {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { details: true },
        });
        if (!booking) {
            throw new BookingNotFoundException();
        }
        booking.details.map((detail) => {
            if (detail.lesson === dto.lesson && detail.tv === dto.tv) {
                throw new LessonExistingConflictException();
            }
        });

        await this.prisma.detail.create({
            data: {
                bookingId: bookingId,
                lesson: dto.lesson,
                userId: userId,
                tv: dto.tv,
            },
        });
        const updatedBooking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { details: { include: { user: true } } },
        });

        const parsed = BookingResponseSchema.parse(updatedBooking);
        return {
            good: true,
            response: parsed,
        };
    }

    async updateBookingDetail(
        detailId: string,
        dto: UpdateBookingDetailDto,
    ): Promise<TApiResp<TApiDetailResponse>> {
        await this.findDetailById(detailId);
        const detail = await this.prisma.detail.update({
            where: { id: detailId },
            data: {
                tv: dto.tv,
                lesson: dto.lesson,
            },
        });
        const parsed = DetailResponseSchema.parse(detail);
        return {
            good: true,
            response: parsed,
        };
    }

    async getAllBookings(): Promise<TApiResp<TApiBookingsResponse>> {
        const bookings = await this.prisma.booking.findMany({
            include: { details: { include: { user: true } } },
            orderBy: { bookingDate: 'desc' },
        });
        const parsed = BookingsResponseSchema.parse(bookings);
        const count = await this.prisma.booking.count();
        return {
            good: true,
            response: parsed,
            count: count,
        };
    }

    async getOneBooking(
        bookingId: string,
    ): Promise<TApiResp<TApiBookingResponse>> {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { details: { include: { user: true } } },
        });
        if (!booking) {
            throw new BookingNotFoundException();
        }
        const parsed = BookingResponseSchema.parse(booking);
        return {
            good: true,
            response: parsed,
        };
    }

    async getMyBooking(
        userId: string,
    ): Promise<TApiResp<TApiMyDetailsResponse>> {
        await this.findUserById(userId);
        const bookingDetails = await this.prisma.detail.findMany({
            where: { userId: userId },
            include: { booking: true, user: true },
        });
        const parsed = MyDetailsResponseSchema.parse(bookingDetails);
        return { good: true, response: parsed };
    }

    async deleteBookingDetail(detailId: string): Promise<TApiResp<true>> {
        await this.findDetailById(detailId);
        await this.prisma.detail.delete({
            where: { id: detailId },
        });
        return {
            good: true,
        };
    }

    private async findDetailById(detailId: string) {
        const detail = await this.prisma.detail.findUnique({
            where: { id: detailId },
        });
        if (!detail) {
            throw new BookingDetailNotFoundException();
        }
        return detail;
    }

    private async isBookingDateExist(date: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { bookingDate: date },
        });
        if (booking) {
            throw new BookingDateExistenceException();
        }
    }

    private async findUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
    }

    private async findBookingById(bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new BookingNotFoundException();
        }
        return booking;
    }
}
