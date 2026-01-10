import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
} from '@nestjs/common';
import { FoldersService } from './application/folders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { Folder } from './domain/folder.entity';
import { FolderDeleteResponseDto } from '@echomind/shared';

const CreateFolderSchema = z.object({
  name: z.string(),
  parentId: z.string().optional(),
});

class CreateFolderDto extends createZodDto(CreateFolderSchema) {}

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<Folder> {
    return this.foldersService.create(
      req.user.userId,
      createFolderDto.name,
      createFolderDto.parentId,
    );
  }

  @Get()
  async findAll(@Request() req: RequestWithUser): Promise<Folder[]> {
    return this.foldersService.findAll(req.user.userId);
  }

  @Delete(':id')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<FolderDeleteResponseDto> {
    return this.foldersService.delete(req.user.userId, id);
  }
}
