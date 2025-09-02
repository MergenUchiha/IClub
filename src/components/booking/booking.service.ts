import { Injectable } from '@nestjs/common';
import {
    AddBookingDetailDto,
    BookingResponseSchema,
    BookingsResponseSchema,
    CreateBookingDto,
    DetailResponseSchema,
    TApiBookingResponse,
    TApiBookingsResponse,
    TApiDetailResponse,
    UpdateBookingDetailDto,
} from 'src/libs/contracts';
import {
    BookingDateExistenceException,
    BookingDetailNotFoundException,
    BookingNotFoundException,
    LessonExistingConflictException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
    constructor(private prisma: PrismaService) {}

    async createBooking(
        dto: CreateBookingDto,
    ): Promise<TApiResp<TApiBookingResponse>> {
        const date = new Date().toISOString().split('T')[0]!;
        await this.isBookingDateExist(date);
        const booking = await this.prisma.booking.create({
            data: {
                bookingDate: date,
                details: {
                    create: {
                        group: dto.details.group,
                        phoneNumber: dto.details.phoneNumber,
                        lesson: dto.details.lesson,
                        teachersDepartment: dto.details.teachersDepartment,
                        teacher: dto.details.teacher,
                        department: dto.details.department,
                        tv: dto.details.tv,
                        lessonNumber: dto.details.lessonNumber,
                    },
                },
            },
            include: { details: true },
        });
        const parsed = BookingResponseSchema.parse(booking);
        return {
            good: true,
            response: parsed,
        };
    }

    async addToExistingBooking(
        bookingId: string,
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
                group: dto.group,
                phoneNumber: dto.phoneNumber,
                lesson: dto.lesson,
                teachersDepartment: dto.teachersDepartment,
                teacher: dto.teacher,
                department: dto.department,
                lessonNumber: dto.lessonNumber,
                tv: dto.tv,
            },
        });
        const updatedBooking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { details: true },
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
                group: dto.group,
                phoneNumber: dto.phoneNumber,
                teacher: dto.teacher,
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
            include: { details: true },
        });
        const parsed = BookingsResponseSchema.parse(bookings);

        return {
            good: true,
            response: parsed,
        };
    }

    async getOneBooking(
        bookingId: string,
    ): Promise<TApiResp<TApiBookingResponse>> {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { details: true },
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
