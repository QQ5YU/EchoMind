import { Transcript } from './transcript.entity';

export abstract class TranscriptRepository {
  abstract findByAudioFileId(audioFileId: string): Promise<Transcript | null>;
  abstract save(transcript: Omit<Transcript, 'id' | 'segments'>, segments: Omit<TranscriptSegment, 'id' | 'transcriptId'>[]): Promise<Transcript>;
  abstract search(query: string, userId: string): Promise<any[]>; // Returns segments with audio file info
}

export class TranscriptSegment {
    id: string;
    transcriptId: string;
    text: string;
    startTime: number;
    endTime: number;
}
