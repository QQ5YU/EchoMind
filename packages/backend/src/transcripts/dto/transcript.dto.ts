import { createZodDto } from 'nestjs-zod';
import { CreateTranscriptSchema, TranscriptSchema } from '@echomind/shared';

export class CreateTranscriptDto extends createZodDto(CreateTranscriptSchema) {}
export class TranscriptDto extends createZodDto(TranscriptSchema) {}
