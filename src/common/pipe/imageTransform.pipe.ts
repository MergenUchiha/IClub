import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ITransformedFile } from '../interfaces/fileTransform.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class ImageTransformer implements PipeTransform<Express.Multer.File> {
    private readonly logger = new Logger(ImageTransformer.name);

    async transform(file: Express.Multer.File): Promise<ITransformedFile> {
        if (!file.path || !file.destination) {
            this.logger.error(
                `File path or destination missing: ${JSON.stringify(file)}`,
            );
            throw new BadRequestException('Image not provided');
        }

        this.logger.log(`File saved to: ${file.path}`);

        return {
            fileName: file.filename,
            originalName: file.originalname,
            filePath: `uploads/${file.filename}`, // Относительный путь для базы данных
            mimeType: file.mimetype,
            size: file.size.toString(),
        };
    }
}
