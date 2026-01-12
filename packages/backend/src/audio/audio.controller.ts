import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ParseFilePipe,
  MaxFileSizeValidator,
  Res,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import 'multer';
import { AudioService } from './application/audio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import type { Response } from 'express';
import * as fs from 'fs';
import { AudioFileDto, FileDeleteResponseDto } from '@echomind/shared';

import { TranscriptRepository } from '../transcripts/domain/transcript.repository';

@Controller('audio')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    private readonly transcriptRepository: TranscriptRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<AudioFileDto> {
    return await this.audioService.uploadFile(req.user.userId, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteFile(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<FileDeleteResponseDto> {
    return await this.audioService.deleteFile(req.user.userId, id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: RequestWithUser): Promise<AudioFileDto[]> {
    return await this.audioService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<AudioFileDto> {
    return await this.audioService.findOne(id, req.user.userId);
  }

  @Get(':id/transcript')
  @UseGuards(JwtAuthGuard)
  async getTranscript(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    await this.audioService.findOne(id, req.user.userId);
    const transcript = await this.transcriptRepository.findByAudioFileId(id);
    if (!transcript) throw new NotFoundException('Transcript not found');
    return transcript;
  }

  @Get(':id/file')
  async streamFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.audioService.findByIdInternal(id);
    if (!file) throw new NotFoundException('File not found');

    if (!fs.existsSync(file.filePath)) {
      throw new NotFoundException('File on disk not found');
    }

    const stat = fs.statSync(file.filePath);
    const fileSize = stat.size;
    const range = res.req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(file.filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(200, head);
      fs.createReadStream(file.filePath).pipe(res);
    }
  }
}
