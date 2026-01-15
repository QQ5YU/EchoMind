import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as path from 'path';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    let url = process.env.DATABASE_URL ?? '';

    // Fix: Adjust SQLite path for Runtime (NestJS) vs CLI
    // CLI resolves 'file:./dev.db' relative to schema.prisma (in prisma/ folder)
    // Runtime resolves 'file:./dev.db' relative to CWD (backend root)
    // We rewrite it here to ensure Runtime looks in 'prisma/' folder
    if (url.startsWith('file:./') && !url.includes('prisma')) {
      const dbPath = url.replace('file:./', '');
      url = `file:${path.join(process.cwd(), 'prisma', dbPath)}`;
    }

    const adapter = new PrismaBetterSqlite3({
      url,
    });

    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
