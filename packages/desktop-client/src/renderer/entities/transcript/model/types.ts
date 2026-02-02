export interface TranscriptSegment {
  start: number;
  text: string;
}

export interface Transcript {
  id: string;
  audioId: string;
  segments: TranscriptSegment[];
}
