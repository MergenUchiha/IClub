import { UnsupportedMediaTypeException } from '@nestjs/common';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

const validFileExtensions = ['jpg', 'jpeg', 'png', 'gif'];
const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

export function imageFilter(
    _request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
) {
    const extension = file.originalname.split('.').pop()?.toLowerCase() ?? '';

    if (!validFileExtensions.includes(extension)) {
        callback(new UnsupportedMediaTypeException('Invalid file extension.'));
        return;
    }

    if (!validMimeTypes.includes(file.mimetype)) {
        callback(new UnsupportedMediaTypeException('Invalid mime type.'));
        return;
    }

    callback(null, true);
}
