export class TranscriptSegment {
  id!: string;
  transcriptId!: string;
  text!: string;
  startTime!: number;
  endTime!: number;

  constructor(partial: Partial<TranscriptSegment>) {
    Object.assign(this, partial);
  }
}

export class Transcript {
  id!: string;
  audioFileId!: string;
  language!: string | null;
  segments!: TranscriptSegment[];

  constructor(partial: Partial<Transcript>) {
    Object.assign(this, partial);
  }
}
