import { z } from "zod";

export enum AudioStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  PROCESSED = "processed",
  ERROR = "error",
}

export const AudioStatusSchema = z.enum([
  AudioStatus.PENDING,
  AudioStatus.PROCESSING,
  AudioStatus.PROCESSED,
  AudioStatus.ERROR,
]);
