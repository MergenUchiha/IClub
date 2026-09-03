import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ITransformedFile } from '../interfaces/fileTransform.interface';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageTransformer implements PipeTransform<Express.Multer.File> {
    private readonly logger = new Logger(ImageTransformer.name);
    constructor(private configService: ConfigService) {}

    transform(file: Express.Multer.File): ITransformedFile {
        if (!file.path || !file.destination) {
            this.logger.error(
                `File path or destination missing: ${JSON.stringify(file)}`,
            );
            throw new BadRequestException('Image not provided');
        }

        const backendUrl = this.configService.getOrThrow<string>('BACKEND_URL');
        this.logger.log(`File saved to: ${file.path}`);

        return {
            fileName: file.filename,
            originalName: file.originalname,
            // Absolute URL, so the value can be served to clients as-is.
            filePath: `${backendUrl}/uploads/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size.toString(),
        };
    }
}
