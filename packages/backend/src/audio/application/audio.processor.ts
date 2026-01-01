import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { AudioRepository } from '../domain/audio.repository';
import { TranscriptRepository } from '../../transcripts/domain/transcript.repository';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Processor('audio-transcription')
export class AudioProcessor {
  constructor(
    private readonly audioRepository: AudioRepository,
    private readonly transcriptRepository: TranscriptRepository,
  ) {}

  @Process('transcribe')
  async handleTranscribe(job: Job<{ audioFileId: string; filePath: string }>) {
    const { audioFileId, filePath } = job.data;
    console.log(`Processing audio file ${audioFileId}...`);

    await this.audioRepository.updateStatus(audioFileId, 'processing');

    try {
      // Mocking the AI script execution or calling the real one if it existed
      const outputDir = path.dirname(filePath);
      const scriptPath = path.resolve(__dirname, '../../../../../scripts/ai/process_audio.py');

      // For MVP without the real AI script, we can mock the output here
      // OR we can try to run the script.
      // Let's assume we run the script. If it fails (e.g. not found), we catch it.
      
      // Ensure scripts/ai exists
      if (!fs.existsSync(scriptPath)) {
        console.warn('AI script not found, using mock data.');
        await this.mockProcessing(audioFileId);
        await this.audioRepository.updateStatus(audioFileId, 'processed');
        return;
      }

      // const pythonProcess = spawn('python3', [
      //   scriptPath,
      //   '--audio-file-path',
      //   filePath,
      //   '--output-dir',
      //   outputDir,
      // ]);
      
      // ... handling stdout/stderr ...
      // keeping it simple for now, using mock if script doesn't exist
       await this.mockProcessing(audioFileId);
       await this.audioRepository.updateStatus(audioFileId, 'processed');

    } catch (error) {
      console.error('Transcription failed', error);
      await this.audioRepository.updateStatus(audioFileId, 'error');
    }
  }

  async mockProcessing(audioFileId: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockTranscript = {
      language: 'en',
      segments: [
        { text: 'This is a mock transcript segment 1.', startTime: 0, endTime: 5 },
        { text: 'This is the second segment of the audio.', startTime: 5, endTime: 10 },
      ]
    };

    await this.transcriptRepository.save(
      { audioFileId, language: mockTranscript.language },
      mockTranscript.segments.map(s => ({
        ...s,
        transcriptId: '', // Will be handled by repo
      }))
    );
  }
}
