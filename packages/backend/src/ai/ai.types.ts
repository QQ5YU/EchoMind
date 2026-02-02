export interface TranscribeRequest {
  type: 'transcribe';
  request_id: string;
  payload: {
    audio_file_path: string;
    audio_file_id: string;
    language?: string;
  };
}

export interface TranscribeResponse {
  type: 'transcribe_response';
  request_id: string;
  status: 'success' | 'error';
  payload: {
    transcript_id?: string;
    language?: string;
    segments?: Array<{
      text: string;
      start: number;
      end: number;
    }>;
    message?: string;
  };
}

export type AiMessage = TranscribeRequest | TranscribeResponse;
