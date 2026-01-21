import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { UserRepository } from './domain/user.repository';
import { UserController } from './user.controller';
import { UserMapper } from './user.mapper';
import { StorageModule } from '../core/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserMapper,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserService, UserMapper],
})
export class UserModule {}
