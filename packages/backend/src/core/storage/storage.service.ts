import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import {
  FileOperationException,
  EntityNotFoundException,
} from '../error-handling/exceptions/application.exception';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  async save(relativePath: string, buffer: Buffer): Promise<void> {
    const fullPath = this.resolvePath(relativePath);
    const dir = path.dirname(fullPath);
    try {
      await this.ensureDirectoryExists(dir);
      await fs.writeFile(fullPath, buffer);
    } catch (error) {
      this.logger.error(`Failed to save file: ${fullPath}`, error);
      throw new FileOperationException(
        `Failed to save file at ${relativePath}`,
      );
    }
  }

  async delete(relativePath: string): Promise<void> {
    const fullPath = this.resolvePath(relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        this.logger.error(`Failed to delete file: ${fullPath}`, error);
        throw new FileOperationException(
          `Failed to delete file at ${relativePath}`,
        );
      }
    }
  }

  getReadStream(relativePath: string): fsSync.ReadStream {
    const fullPath = this.resolvePath(relativePath);
    if (!fsSync.existsSync(fullPath)) {
      throw new EntityNotFoundException('File', relativePath);
    }
    return fsSync.createReadStream(fullPath);
  }

  exists(relativePath: string): boolean {
    const fullPath = this.resolvePath(relativePath);
    return fsSync.existsSync(fullPath);
  }

  getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }

  private resolvePath(relativePath: string): string {
    return path.join(process.cwd(), relativePath);
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
}
