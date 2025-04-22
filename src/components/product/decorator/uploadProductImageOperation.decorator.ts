import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage, FileFastifyInterceptor } from 'fastify-file-interceptor';
import { imageFilter } from 'src/common/filters/imageFilter';
import { randomUUID } from 'crypto';

export function UploadProductImageOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Upload media files for a product' }),
        ApiResponse({
            status: 200,
            description: 'Product image uploaded',
        }),
        ApiResponse({ status: 404, description: 'Product not found' }),
        ApiConsumes('product/multipart/form-data'),
        UseInterceptors(
            FileFastifyInterceptor('image', {
                storage: diskStorage({
                    destination: './temp',
                    filename: (req, file, cb) => {
                        const fileExtension = file.mimetype.split('/')[1];
                        const uniqueFileName = `${randomUUID()}.${fileExtension}`;
                        cb(null, uniqueFileName);
                    },
                }),
                limits: { fileSize: 1024 * 1024 * 1500 },
                fileFilter: imageFilter,
            }),
        ),
    );
}
