import { createZodDto } from 'nestjs-zod';
import { LoginSchema, RegisterSchema } from '@echomind/shared';

export class LoginDto extends createZodDto(LoginSchema) {}
export class RegisterDto extends createZodDto(RegisterSchema) {}
