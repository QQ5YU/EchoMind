import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { UserRepository } from './domain/user.repository';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
