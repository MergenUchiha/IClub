import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import { CreateImageDto } from '../contracts';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(
        private minioService: MinioService,
        private readonly prismaService: PrismaService,
    ) {}

    async createProductFileMedia(file: ITransformedFile) {
        const mediaData: CreateImageDto = {
            originalName: file.originalName,
            fileName: file.fileName,
            filePath: file.filePath,
            mimeType: file.mimeType,
            size: file.size,
            productId: file.productId,
        };

        const media = await this.prismaService.image.create({
            data: mediaData,
        });

        return media.id;
    }

    async deleteMedias(fileIds: string[]) {
        this.logger.log(
            `Удаление медиа с идентификаторами: ${fileIds.join(', ')}`,
        );
        const files = await this.prismaService.image.findMany({
            where: { id: { in: fileIds } },
        });
        if (!files.length) {
            this.logger.warn('Некоторые файлы не найдены!');
            throw new NotFoundException('Some files are not found!');
        }
        const fileNames = files.map((file) => file.fileName);
        this.minioService.deleteFiles(fileNames);
        await this.prismaService.image.deleteMany({
            where: { id: { in: fileIds } },
        });
    }

    async deleteMedia(mediaId: string) {
        this.logger.log(`Удаление медиа с идентификатором: ${mediaId}`);
        const file = await this.prismaService.image.findFirst({
            where: { id: mediaId },
        });
        if (!file) {
            this.logger.warn(`Медиа с идентификатором ${mediaId} не найдено!`);
            throw new NotFoundException('Media not found!');
        }
        await this.minioService.deleteFile(file.fileName);
        await this.prismaService.image.delete({
            where: { id: mediaId },
        });
    }

    async getOneMedia(mediaId: string) {
        this.logger.log(`Получение медиа с идентификатором: ${mediaId}`);
        const media = await this.prismaService.image.findUnique({
            where: { id: mediaId },
        });
        if (!media) {
            this.logger.warn(`Медиа с идентификатором ${mediaId} не найдено!`);
            throw new NotFoundException('Media not found!');
        }
        return media;
    }
}
