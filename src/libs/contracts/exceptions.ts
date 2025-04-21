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

export class ShopNotFoundException extends ApiBaseException {
    static CODE = 2;
    constructor() {
        super(
            'Shop not found',
            ShopNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class ShopNameAlreadyExistsException extends ApiBaseException {
    static CODE = 3;
    constructor() {
        super(
            'Shop name already exists',
            ShopNotFoundException.CODE,
            null,
            HttpStatus.CONFLICT,
        );
    }
}

export class RegionNotFoundException extends ApiBaseException {
    static CODE = 4;
    constructor() {
        super(
            'Region not found',
            RegionNotFoundException.CODE,
            null,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class ImageNotFoundException extends ApiBaseException {
    static CODE = 5;
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
    static CODE = 6;
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
    static CODE = 7;
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
    static CODE = 8;
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
