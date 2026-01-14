import { createZodDto } from 'nestjs-zod';
import { UserSchema, UpdateUserSchema } from '@echomind/shared';

export class UserDto extends createZodDto(UserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}