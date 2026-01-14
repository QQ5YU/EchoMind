import { z } from "zod";
import { AudioStatusSchema } from "../enums/audio.enum";

export const AudioFileSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    folderId: z.string().nullable(),
    fileName: z.string().min(1),
    filePath: z.string().min(1),
    status: AudioStatusSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });

export type AudioFileDto = z.infer<typeof AudioFileSchema>;

export const FileDeleteResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: AudioFileSchema,
  });

export type FileDeleteResponseDto = z.infer<typeof FileDeleteResponseSchema>;
