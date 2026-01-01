import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersPrismaRepository } from './infrastructure/users.prisma.repository';
import { UsersRepository } from './domain/users.repository';

@Module({
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
