import { HttpException, HttpStatus } from '@nestjs/common';
import { TApiRespBad } from './interface';

export class ApiBaseException extends HttpException {
    constructor(
        public errorMessage: string,
        public errorCode: number,
        public extra: Record<string, any> | null = null,
        public httpStatus = HttpStatus.BAD_REQUEST,
    ) {
        const response: TApiRespBad = {
            good: false,
            errorMessage,
            errorCode,
        };
        if (extra) response.extra = extra;
        super(response, httpStatus);
    }
}

export class UnknownException extends ApiBaseException {
    static CODE = -1;
    constructor() {
        super(
            'Unknown error',
            UnknownException.CODE,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

export class UnspecifiedException extends ApiBaseException {
    static CODE = 0;
    constructor(info: string) {
        super(
            `${info}. Don't use this error's code, because it's not unique.`,
            UnspecifiedException.CODE,
            null,
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class WrapperExceptionForNestHttpException extends ApiBaseException {
    static CODE = -2;
    constructor(exception: HttpException) {
        const exceptionResponse = exception.getResponse();
        const extra =
            typeof exceptionResponse !== 'string'
                ? exceptionResponse
                : { message: exceptionResponse };
        super(
            'Wrapped error',
            WrapperExceptionForNestHttpException.CODE,
            extra,
            exception.getStatus(),
        );
    }
}

export class ValidationException extends ApiBaseException {
    static CODE = 1;
    constructor(extra: Record<string, any>) {
        super(
            'Validation error',
            ValidationException.CODE,
            extra,
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class CategoryNotFoundException extends ApiBaseException {
    static CODE = 2;
    constructor() {
        super(
            'Category not found',
            CategoryNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class CategoryNameAlreadyExistsException extends ApiBaseException {
    static CODE = 3;
    constructor() {
        super(
            'Category name already exists',
            CategoryNotFoundException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}

export class ImageNotFoundException extends ApiBaseException {
    static CODE = 4;
    constructor() {
        super(
            'Image not found',
            ImageNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class ProductNotFoundException extends ApiBaseException {
    static CODE = 5;
    constructor() {
        super(
            'Product not found',
            ProductNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class UserNotFoundException extends ApiBaseException {
    static CODE = 6;
    constructor() {
        super(
            'User not found',
            UserNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class UserPhoneNumberAlreadyExistsException extends ApiBaseException {
    static CODE = 7;
    constructor() {
        super(
            'User phone number already exists',
            UserPhoneNumberAlreadyExistsException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}

export class UserWrongPasswordAlreadyExistsException extends ApiBaseException {
    static CODE = 8;
    constructor() {
        super(
            'Password is wrong',
            UserWrongPasswordAlreadyExistsException.CODE,
            null,
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class OrderConflictException extends ApiBaseException {
    static CODE = 9;
    constructor() {
        super(
            'Can not create an order',
            OrderConflictException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}

export class OrderNotFoundException extends ApiBaseException {
    static CODE = 10;
    constructor() {
        super(
            'Order not found',
            OrderNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class BookingNotFoundException extends ApiBaseException {
    static CODE = 11;
    constructor() {
        super(
            'Booking not found',
            BookingNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class BookingDateExistenceException extends ApiBaseException {
    static CODE = 12;
    constructor() {
        super(
            'Booking already exists,please add details',
            BookingDateExistenceException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}

export class BookingDetailNotFoundException extends ApiBaseException {
    static CODE = 13;
    constructor() {
        super(
            'Booking detail not found',
            BookingDetailNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class LessonExistingConflictException extends ApiBaseException {
    static CODE = 14;
    constructor() {
        super(
            'Lesson or place already booked,please choose another lesson or place',
            LessonExistingConflictException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}

export class UserBannedException extends ApiBaseException {
    static CODE = 15;
    constructor() {
        super(
            'User was banned!',
            UserBannedException.CODE,
            null,
            HttpStatus.FORBIDDEN,
        );
    }
}

export class OrderCancelConflictException extends ApiBaseException {
    static CODE = 16;
    constructor() {
        super(
            'Cannot cancel a verified or completed order.',
            OrderCancelConflictException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}
export class OrderCompleteConflictException extends ApiBaseException {
    static CODE = 17;
    constructor() {
        super(
            'Cannot complete a verified or cancelled order.',
            OrderCompleteConflictException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}

export class OrderUpdateConflictException extends ApiBaseException {
    static CODE = 18;
    constructor() {
        super(
            'Can not update an order',
            OrderUpdateConflictException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}
