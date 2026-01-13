import { z } from "zod";

export const UpdateSettingsSchema = z.object({
  defaultLanguage: z.string(),
});

export type UpdateSettingsDto = z.infer<typeof UpdateSettingsSchema>;
