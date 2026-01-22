import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).optional(),
  avatarUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type UserDto = z.infer<typeof UserSchema>;

export const UpdateUserSchema = z
  .object({
    name: z.string().min(1).optional(),
  })
  .strict();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
