import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfirmUploadDto, CreateUploadUrlDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeFileName(fileName: string) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  async createUploadUrl(userId: string, dto: CreateUploadUrlDto) {
    const provider = (process.env.MEDIA_PROVIDER || 'mock').toLowerCase();
    const safeFileName = this.sanitizeFileName(dto.fileName);
    const key = `${userId}/${Date.now()}-${safeFileName}`;
    const kind = dto.kind || 'general';
    const mimeType = dto.mimeType || 'application/octet-stream';

    if (provider === 'cloudinary') {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) {
        throw new BadRequestException('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.');
      }
      const publicId = `${kind}/${key}`;
      return {
        provider: 'cloudinary',
        method: 'POST',
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        fields: {
          upload_preset: uploadPreset,
          public_id: publicId,
        },
        publicUrl: `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`,
        mimeType,
      };
    }

    if (provider === 's3') {
      throw new BadRequestException(
        'S3 signing is not configured in this MVP build. Use MEDIA_PROVIDER=mock or MEDIA_PROVIDER=cloudinary.',
      );
    }

    return {
      provider: 'mock',
      method: 'PUT',
      uploadUrl: `https://uploads.internably.local/${key}`,
      publicUrl: `https://cdn.internably.local/${key}`,
      fields: {},
      mimeType,
    };
  }

  async confirmUpload(userId: string, dto: ConfirmUploadDto) {
    return this.prisma.mediaAsset.create({
      data: {
        ownerId: userId,
        url: dto.url,
        mimeType: dto.mimeType,
        kind: dto.kind,
      },
    });
  }
}

