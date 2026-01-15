import { createZodDto } from 'nestjs-zod';
import { AudioFileSchema, FileDeleteResponseSchema } from '@echomind/shared';

export class AudioFileDto extends createZodDto(AudioFileSchema) {}
export class FileDeleteResponseDto extends createZodDto(FileDeleteResponseSchema) {}
