import { z } from "zod";

export const TranscriptSegmentSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

export type TranscriptSegmentDto = z.infer<typeof TranscriptSegmentSchema>;

export const CreateTranscriptSchema = z.object({
  audioFileId: z.string().uuid(),
  language: z.string().default("unknown"),
  segments: z.array(TranscriptSegmentSchema),
});

export type CreateTranscriptDto = z.infer<typeof CreateTranscriptSchema>;

export const TranscriptSchema = z.object({
  id: z.string().uuid(),
  audioFileId: z.string().uuid(),
  language: z.string().nullable(),
  segments: z.array(TranscriptSegmentSchema),
});

export type TranscriptDto = z.infer<typeof TranscriptSchema>;
