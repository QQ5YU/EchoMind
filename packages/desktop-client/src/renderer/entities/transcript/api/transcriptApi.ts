import { api } from "@shared/api";
import { TranscriptSegment } from "../model/types";
import { TranscriptDto } from "@echomind/shared";

export const transcriptApi = {
  getById: async (audioId: string): Promise<TranscriptSegment[]> => {
    const { data } = await api.get<TranscriptDto | null>(
      `/api/transcripts/${audioId}`,
    );

    if (data && Array.isArray(data.segments)) {
      return data.segments.map((s) => ({
        start: s.start,
        text: s.text,
      }));
    }
    return [];
  },
};
