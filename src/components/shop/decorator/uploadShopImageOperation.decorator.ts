import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage, FileFastifyInterceptor } from 'fastify-file-interceptor';
import { imageFilter } from 'src/common/filters/imageFilter';
import { randomUUID } from 'crypto';

export function UploadShopImageOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Upload media files for a shop' }),
        ApiResponse({
            status: 200,
            description: 'Shop image uploaded',
        }),
        ApiResponse({ status: 404, description: 'Shop not found' }),
        ApiConsumes('shop/multipart/form-data'),
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
