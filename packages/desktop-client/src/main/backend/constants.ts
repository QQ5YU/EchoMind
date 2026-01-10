// Controllers
import { AuthController } from "@backend/auth/auth.controller";
import { AudioController } from "@backend/audio/audio.controller";
import { FoldersController } from "@backend/folders/folders.controller";
import { SearchController } from "@backend/search/search.controller";
import { SettingsController } from "@backend/settings/settings.controller";

/**
 * All NestJS Controllers that need to be exposed via IPC
 */
export const APP_CONTROLLERS = [
  AuthController,
  AudioController,
  FoldersController,
  SearchController,
  SettingsController,
];
