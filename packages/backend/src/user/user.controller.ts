import {
  Controller,
  Get,
  Patch,
  Body,
  Request,
  UseGuards,
  Post,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseInterceptors,
  FileTypeValidator,
  ForbiddenException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { UserService } from './application/user.service';
import { JwtAuthGuard } from '@auth/guards';
import { UserDto, UpdateUserDto } from './dto/user.dto';
import { EntityNotFoundException } from '@core/error-handling';
import type { RequestWithUser } from '@auth/types/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as path from 'path';
import { StorageService } from '@core/storage';
import { generateETag } from '@core/utils/etag';
import { UserMapper } from './user.mapper';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly userMapper: UserMapper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getProfile(@Request() req: RequestWithUser): Promise<UserDto> {
    const user = await this.userService.findById(req.user.userId);
    if (!user) {
      throw new EntityNotFoundException('User', req.user.userId);
    }
    return this.userMapper.toDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('avatar/:id')
  async getAvatar(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.user.userId !== id) {
      throw new ForbiddenException('You can only access your own avatar.');
    }

    const avatarStream = await this.userService.getAvatarStream(id);
    const avatarEtag = await generateETag(avatarStream);

    const filePath = avatarStream.path.toString();
    const contentType = this.storageService.getMimeType(filePath);

    const ifNoneMatch = req.headers['if-none-match'] as string | undefined;

    if (ifNoneMatch) {
      const normalized = ifNoneMatch.replace(/^W\//, '').replace(/"/g, '');
      if (normalized === avatarEtag) {
        res.status(304).end();
        return;
      }
    }

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="avatar-${id}${path.extname(filePath)}"`,
      'Cache-Control': 'public, max-age=86400',
      ETag: `"${avatarEtag}"`,
    });

    return new StreamableFile(avatarStream);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('info')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.userService.updateProfile(
      req.user.userId,
      body.name,
    );
    return this.userMapper.toDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatar')
  async updateAvatar(
    @Request() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: (maxSize: number) =>
              `The file cannot exceed ${maxSize / 1024 / 1024}MB`,
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<UserDto> {
    const user = await this.userService.updateAvatar(req.user.userId, file);
    return this.userMapper.toDto(user);
  }
}
