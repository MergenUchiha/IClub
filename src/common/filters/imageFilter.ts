import {
    BadRequestException,
    UnsupportedMediaTypeException,
} from '@nestjs/common';

const validFileExtensions = ['jpg', 'jpeg', 'png', 'gif'];
const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

export function imageFilter(req: any, file: any, cb: any) {
    if (!file) throw new BadRequestException('File not provided!');
    if (
        !validFileExtensions.includes(
            file.originalname
                .split('.')
                [file.originalname.split('.').length - 1].toLowerCase(),
        )
    ) {
        cb(new UnsupportedMediaTypeException('Invalid file extension.'), false);
        return;
    }
    if (!validMimeTypes.includes(file.mimetype)) {
        cb(new UnsupportedMediaTypeException('Invalid mime type.'), false);
        return;
    }

    cb(null, true);
}
