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
            `Deleting media: ${fileIds.join(', ')}`,
        );
        const files = await this.prismaService.image.findMany({
            where: { id: { in: fileIds } },
        });
        if (!files.length) {
            this.logger.warn('Some of the requested files do not exist');
            throw new NotFoundException('Some files are not found!');
        }

        // Remove the files from disk before dropping the rows.
        for (const file of files) {
            // filePath is stored as an absolute URL; take the part
            // after /uploads/.
            const relativePath = file.filePath.split('/uploads/')[1];
            if (!relativePath) {
                this.logger.warn(
                    `Unexpected filePath, skipping: ${file.filePath}`,
                );
                continue;
            }
            const filePath = join(process.cwd(), 'uploads', relativePath);
            try {
                await fs.unlink(filePath);
                this.logger.log(`Deleted file ${filePath}`);
            } catch {
                this.logger.warn(`Could not delete file ${filePath}`);
                // Keep going: a missing file must not block the rest.
            }
        }

        // Drop the rows once the files are gone.
        await this.prismaService.image.deleteMany({
            where: { id: { in: fileIds } },
        });
    }

    async deleteMedia(mediaId: string) {
        this.logger.log(`Deleting media ${mediaId}`);
        const file = await this.prismaService.image.findFirst({
            where: { id: mediaId },
        });
        if (!file) {
            this.logger.warn(`Media ${mediaId} not found`);
            throw new NotFoundException('Media not found!');
        }

        const relativePath = file.filePath.split('/uploads/')[1];
        if (!relativePath) {
            this.logger.warn(`Unexpected filePath, skipping: ${file.filePath}`);
        } else {
            const filePath = join(process.cwd(), 'uploads', relativePath);
            try {
                await fs.unlink(filePath);
                this.logger.log(`Deleted file ${filePath}`);
            } catch {
                this.logger.warn(`Could not delete file ${filePath}`);
                // Keep going: the row must be removed either way.
            }
        }

        await this.prismaService.image.delete({
            where: { id: mediaId },
        });
    }

    async getOneMedia(mediaId: string) {
        this.logger.log(`Fetching media ${mediaId}`);
        const media = await this.prismaService.image.findUnique({
            where: { id: mediaId },
        });
        if (!media) {
            this.logger.warn(`Media ${mediaId} not found`);
            throw new NotFoundException('Media not found!');
        }
        return media;
    }
}
