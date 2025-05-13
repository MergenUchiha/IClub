import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage, FileFastifyInterceptor } from 'fastify-file-interceptor';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { imageFilter } from 'src/common/filters/imageFilter';

export function UploadProductImageOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Upload media files for a product' }),
        ApiResponse({
            status: 200,
            description: 'Product image uploaded',
        }),
        ApiResponse({ status: 404, description: 'Product not found' }),
        ApiConsumes('multipart/form-data'),
        UseInterceptors(
            FileFastifyInterceptor('image', {
                storage: diskStorage({
                    destination: join(process.cwd(), 'uploads'), // Сохраняем сразу в Uploads
                    filename: (req, file, cb) => {
                        const fileExtension = file.mimetype.split('/')[1];
                        const uniqueFileName = `${randomUUID()}.${fileExtension}`;
                        cb(null, uniqueFileName);
                    },
                }),
                limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение 5MB
                fileFilter: imageFilter,
            }),
        ),
    );
}
