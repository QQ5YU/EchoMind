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
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response, Request as ExpressRequest } from 'express';
import * as fs from 'fs';
import { AudioFileDto, FileDeleteResponseDto } from './dto/audio.dto';
import { AudioService } from './application/audio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/types/request-with-user.interface';
import { TranscriptRepository } from '../transcripts/domain/transcript.repository';
import { EntityNotFoundException } from '../core/error-handling/exceptions/application.exception';

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
    if (!transcript) throw new EntityNotFoundException('Transcript', id);
    return transcript;
  }

  @Get(':id/file')
  async streamFile(
    @Param('id') id: string,
    @Res() res: Response,
    @Request() req: ExpressRequest,
  ) {
    const file = await this.audioService.findByIdInternal(id);
    if (!file) throw new EntityNotFoundException('AudioFile', id);

    if (!fs.existsSync(file.filePath)) {
      throw new EntityNotFoundException('AudioFile on disk', file.filePath);
    }

    const stat = fs.statSync(file.filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

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
