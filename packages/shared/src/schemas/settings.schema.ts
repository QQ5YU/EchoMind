import { z } from "zod";

export const UpdateSettingsSchema = z
  .object({
    defaultLanguage: z.string(),
  })
  .strict();

export type UpdateSettingsDto = z.infer<typeof UpdateSettingsSchema>;
