import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FoldersService } from './application/folders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

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
  async create(@Request() req: RequestWithUser, @Body() createFolderDto: CreateFolderDto) {
    return this.foldersService.create(req.user.userId, createFolderDto.name, createFolderDto.parentId);
  }

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.foldersService.findAll(req.user.userId);
  }
}
