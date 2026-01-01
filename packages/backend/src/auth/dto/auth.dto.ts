import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthDto extends createZodDto(AuthSchema) {}

export class RegisterDto extends createZodDto(AuthSchema) {}
export class LoginDto extends createZodDto(AuthSchema) {}
