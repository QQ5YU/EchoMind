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
import { JwtAuthGuard } from '@auth/guards';
import type { RequestWithUser } from '@auth/types/request-with-user.interface';
import {
  CreateFolderDto,
  FolderDeleteResponseDto,
  FolderDto,
} from './dto/folders.dto';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<FolderDto> {
    return await this.foldersService.create(
      req.user.userId,
      createFolderDto.name,
      createFolderDto.parentId,
    );
  }

  @Get()
  async findAll(@Request() req: RequestWithUser): Promise<FolderDto[]> {
    return await this.foldersService.findAll(req.user.userId);
  }

  @Delete(':id')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<FolderDeleteResponseDto> {
    return await this.foldersService.delete(req.user.userId, id);
  }
}
