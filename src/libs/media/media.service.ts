import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(private readonly prismaService: PrismaService) {}

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

        // Удаляем физические файлы из папки uploads
        for (const file of files) {
            // Извлекаем относительный путь из полного URL
            const relativePath = file.filePath.split('/uploads/')[1];
            if (!relativePath) {
                this.logger.warn(`Некорректный filePath: ${file.filePath}`);
                continue;
            }
            const filePath = join(process.cwd(), 'uploads', relativePath);
            try {
                await fs.unlink(filePath);
                this.logger.log(`Файл удален: ${filePath}`);
            } catch {
                this.logger.warn(`Не удалось удалить файл ${filePath}`);
                // Продолжаем, чтобы не прерывать удаление других файлов
            }
        }

        // Удаляем записи из базы данных
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

        // Извлекаем относительный путь из полного URL
        const relativePath = file.filePath.split('/uploads/')[1];
        console.log(relativePath);
        if (!relativePath) {
            this.logger.warn(`Некорректный filePath: ${file.filePath}`);
        } else {
            const filePath = join(process.cwd(), 'uploads', relativePath);
            try {
                await fs.unlink(filePath);
                this.logger.log(`Файл удален: ${filePath}`);
            } catch {
                this.logger.warn(`Не удалось удалить файл ${filePath}`);
                // Продолжаем, чтобы не прерывать удаление записи
            }
        }

        // Удаляем запись из базы данных
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
