import { z } from "zod";
import { UserSchema } from "./user.schema";

export const AuthResponseSchema = z
  .object({
    access_token: z.string(),
    user: UserSchema,
  })
  .strict()
  .required();

export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
