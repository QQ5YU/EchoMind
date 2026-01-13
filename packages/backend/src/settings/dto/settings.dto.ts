import { createZodDto } from 'nestjs-zod';
import { UpdateSettingsSchema } from '@echomind/shared';

export class UpdateSettingsDto extends createZodDto(UpdateSettingsSchema) {}
