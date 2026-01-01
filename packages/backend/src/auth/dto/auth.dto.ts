import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const RegisterSchema = AuthSchema.extend({
  name: z.string().min(2),
  confirmPassword: z.string().min(6)
})

export class AuthDto extends createZodDto(AuthSchema) { }

export class RegisterDto extends createZodDto(RegisterSchema) { }
export class LoginDto extends createZodDto(AuthSchema) { }
