import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TranscribeRequest, TranscribeResponse } from './ai.types';

@Injectable()
export class AiProcessService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AiProcessService.name);
  private pythonProcess: ChildProcess | null = null;
  private pendingRequests = new Map<
    string,
    {
      resolve: (value: TranscribeResponse['payload']) => void;
      reject: (reason?: any) => void;
    }
  >();

  onModuleInit() {
    this.startPythonProcess();
  }

  onModuleDestroy() {
    this.stopPythonProcess();
  }

  async transcribe(
    filePath: string,
    fileId: string,
  ): Promise<TranscribeResponse['payload']> {
    if (!this.pythonProcess) {
      throw new Error('AI Process is not running.');
    }

    const requestId = uuidv4();
    const request: TranscribeRequest = {
      type: 'transcribe',
      request_id: requestId,
      payload: {
        audio_file_path: filePath,
        audio_file_id: fileId,
      },
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });

      const message = JSON.stringify(request) + '\n';
      const success = this.pythonProcess?.stdin?.write(message);

      if (!success) {
        this.pendingRequests.delete(requestId);
        reject(new Error('Failed to write message to Python process stdin.'));
      }
    });
  }

  private startPythonProcess() {
    const workspaceRoot = path.resolve(__dirname, '../../../../..');
    const pythonExec = path.join(
      workspaceRoot,
      'packages/ai-service/.venv/bin/python',
    );
    const scriptPath = path.join(workspaceRoot, 'packages/ai-service/main.py');

    this.logger.log(`Starting AI Process: ${pythonExec} ${scriptPath}`);

    this.pythonProcess = spawn(pythonExec, [scriptPath]);

    this.pythonProcess.stdout?.on('data', (data) =>
      this.handleStdout(data.toString()),
    );
    this.pythonProcess.stderr?.on('data', (data) =>
      this.handleStderr(data.toString()),
    );

    this.pythonProcess.on('exit', (code) => {
      this.logger.warn(`AI Process exited with code ${code}`);
      this.pythonProcess = null;
    });
  }

  private stopPythonProcess() {
    if (this.pythonProcess) {
      this.logger.log('Stopping AI Process...');
      this.pythonProcess.kill();
      this.pythonProcess = null;
    }
  }

  private handleStdout(data: string) {
    const lines = data.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const response: TranscribeResponse = JSON.parse(line);
        this.dispatchResponse(response);
      } catch (error) {
        this.logger.error(`Failed to parse AI response: ${line}`, error);
      }
    }
  }

  private handleStderr(data: string) {
    if (data.includes('ERROR') || data.includes('CRITICAL')) {
      this.logger.error(`[AI Process]: ${data.trim()}`);
    } else {
      this.logger.debug(`[AI Process]: ${data.trim()}`);
    }
  }

  private dispatchResponse(response: TranscribeResponse) {
    const pending = this.pendingRequests.get(response.request_id);

    if (pending) {
      if (response.status === 'success') {
        pending.resolve(response.payload);
      } else {
        pending.reject(new Error(response.payload.message || 'Unknown Error'));
      }
      this.pendingRequests.delete(response.request_id);
    }
  }
}
