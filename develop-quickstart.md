# 開發快速上手 (Quick Start)

此文件幫助團隊成員快速在本機建立並啟動開發環境，重點為 monorepo 與 `desktop-client`。

**前提**

- 安裝 Node.js (建議使用 LTS，例如 Node 18 或 Node 20)
- 啟用 Corepack 或安裝 pnpm（專案使用 pnpm@10.24.0）

若使用 Corepack（建議）:

```bash
corepack enable
corepack prepare pnpm@10.24.0 --activate
```

# 開發快速上手 (Quick Start)

適用系統：Linux / macOS

此文件說明啟動專案所需的前置作業與「前端 (desktop-client)」與「後端 (backend)」分別要做的步驟。

1. 全域前置需求

- Node.js (建議使用 Node 22 或以上，至少 Node 22)
- pnpm（專案使用 pnpm@10.24.0）：建議用 Corepack 或全域安裝
- Git
- 可選：`nvm` / `volta` 管理 Node 版本

Corepack 範例：

```bash
corepack enable
corepack prepare pnpm@10.24.0 --activate
```

或全域安裝 pnpm：

```bash
npm install -g pnpm@10.24.0
```

2. 取得原始碼並安裝依賴

```bash
git clone <repo-url>
cd EchoMind
pnpm install
```

`pnpm install` 會在 monorepo 內安裝所有 packages 的依賴，並執行各 package 的 `postinstall`（例如 electron native 相依處理）。

3. 後端（packages/backend） — 必需步驟

- 檢查 `.env`：`packages/backend/.env`（預設使用 SQLite 檔案 `file:./dev.db`）。若要修改，編輯或複製範例檔再更新：

```bash
cd packages/backend
# 若要使用自訂環境檔：cp .env.sample .env && edit .env
```

- （第一次或要套用 migrations）執行 Prisma migration（將 migration 套用到資料庫）：

```bash
pnpm --filter backend exec prisma migrate deploy
```

或在開發時重置並重建（會清除資料庫，僅在 dev 使用）：

```bash
pnpm --filter backend exec prisma migrate reset --force
```

- 啟動後端（開發模式，會自動重載）：

```bash
pnpm --filter backend run start:dev
```

預設後端監聽埠：`3000`（可在 `packages/backend/.env` 或程式碼中調整）。

4. 前端（packages/desktop-client） — 必需步驟

- 若已在 repo 根目錄執行過 `pnpm install`，不需再重複安裝。
- 啟動 Electron + Vite 開發環境：

```bash
pnpm --filter desktop-client run dev
```

- 僅開發 renderer（網頁）時：

```bash
pnpm --filter desktop-client run dev:web
```

- 若要建置桌面應用：

```bash
pnpm --filter desktop-client run build
```

- 若需要設定前端環境變數，請複製範例檔：

```bash
cd packages/desktop-client
cp .env.sample .env
```

- 常見變數：`BACKEND_URL`（預設 `http://localhost:3000`），可在 `.env` 中調整。

5. 同時啟動 & 驗證流程

- 流程建議：先啟動後端（`pnpm --filter backend run start:dev`），確認後端回應（例如 `http://localhost:3000`），再啟動 desktop-client 開發模式。這可避免前端因 API 不可用導致錯誤。

6. Linux / macOS 注意事項

- Electron 在 Linux 上可能需要系統套件（視發行版而定），常見套件包含 `libgtk-3-0`, `libnotify4`, `libnss3`, `libxss1`, `libasound2` 等。若遇到啟動或 native 套件錯誤，請參考官方 Electron troubleshooting。
- macOS 則可能需要在第一次啟動時授權桌面擷圖或音訊權限（視功能而定）。

7. 常見問題與快速修復

- 重新安裝依賴：

```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

- electron-builder native 相依問題：

```bash
cd packages/desktop-client
pnpm exec electron-builder install-app-deps
```

- Node / pnpm 版本錯誤：請使用 `nvm` 或 `volta` 切換到團隊建議的版本。

8. 檢查項

- `node -v`
- `pnpm -v`
- 後端啟動：`pnpm --filter backend run start:dev` → 觀察 `backend running in port 3000`
- 前端啟動：`pnpm --filter desktop-client run dev` → Electron 視窗與 Vite dev server

補充：

- 後端主要設定檔： `packages/backend/.env`、`packages/backend/prisma/schema.prisma`、`packages/backend/package.json`
- 前端主要設定檔： `packages/desktop-client/package.json`