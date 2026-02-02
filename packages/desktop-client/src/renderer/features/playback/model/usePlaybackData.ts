import { useState, useEffect, useCallback } from "react";
import {
  transcriptApi,
  TranscriptSegment,
} from "@renderer/entities/transcript";
import { audioApi } from "@renderer/entities/audio";
import { logger } from "@renderer/shared/utils/logger";

export interface PlaybackData {
  fileName: string;
  segments: TranscriptSegment[];
  isLoading: boolean;
  error: string | null;
}

export const usePlaybackData = (id?: string) => {
  const [data, setData] = useState<PlaybackData>({
    fileName: "Loading...",
    segments: [],
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(() => {
    if (!id) return;

    Promise.all([
      transcriptApi.getById(id).catch((err) => {
        logger.error(err);
        return [] as TranscriptSegment[];
      }),
      audioApi.getById(id).catch((err) => {
        logger.error(err);
        return { fileName: "Error loading file info" };
      }),
    ]).then(([segments, audioInfo]) => {
      segments.sort((a, b) => a.start - b.start);

      setData({
        fileName: audioInfo.fileName,
        segments: segments,
        isLoading: false,
        error: null,
      });
    });
  }, [id]);

  useEffect(() => {
    if (id) {
      setData((prev) => ({ ...prev, isLoading: true }));
      fetchData();
    }
  }, [id, fetchData]);

  return data;
};
