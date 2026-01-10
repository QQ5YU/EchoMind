import { Transcript, TranscriptSegment } from './transcript.entity';

export interface SearchResult {
  segmentId: string;
  text: string;
  startTime: number;
  endTime: number;
  audioFile: {
    id: string;
    fileName: string;
  };
}

export abstract class TranscriptRepository {
  abstract findByAudioFileId(audioFileId: string): Promise<Transcript | null>;
  abstract save(transcript: Omit<Transcript, 'id' | 'segments'>, segments: Omit<TranscriptSegment, 'id' | 'transcriptId'>[]): Promise<Transcript>;
  abstract search(query: string, userId: string): Promise<SearchResult[]>;
}

