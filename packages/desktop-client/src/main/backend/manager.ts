import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { INestApplicationContext } from "@nestjs/common";
import { ElectronAppModule } from "@backend/electron-app.module";
import { logger } from "../logger";

/**
 * Manages the lifecycle of the NestJS embedded backend (Singleton)
 */
export class BackendManager {
  private static instance: BackendManager;
  private context: INestApplicationContext | null = null;

  private constructor() {}

  public static getInstance(): BackendManager {
    if (!BackendManager.instance) {
      BackendManager.instance = new BackendManager();
    }
    return BackendManager.instance;
  }

  public async initialize(): Promise<INestApplicationContext> {
    if (this.context) return this.context;

    try {
      this.context =
        await NestFactory.createApplicationContext(ElectronAppModule);
      logger.info("NestJS Standalone context initialized.");
      return this.context;
    } catch (error) {
      logger.error("Failed to initialize NestJS context:", error);
      throw error;
    }
  }

  public getContext(): INestApplicationContext {
    if (!this.context) {
      throw new Error(
        "BackendManager is not initialized. Call initialize() first.",
      );
    }
    return this.context;
  }

  public async dispose(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
  }
}
