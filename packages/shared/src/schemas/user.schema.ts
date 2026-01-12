import { z } from "zod";

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(1).optional(),
    createdAt: z.string().datetime(),
  })
  .strict()
  .required();

export type UserDto = z.infer<typeof UserSchema>;
