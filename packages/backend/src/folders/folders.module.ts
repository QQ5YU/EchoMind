import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './application/folders.service';
import { FolderRepository } from './domain/folder.repository';
import { FolderPrismaRepository } from './infrastructure/folder.prisma.repository';

@Module({
  controllers: [FoldersController],
  providers: [
    FoldersService,
    {
      provide: FolderRepository,
      useClass: FolderPrismaRepository,
    },
  ],
})
export class FoldersModule {}
