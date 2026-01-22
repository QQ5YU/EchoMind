# ESLint Boundaries - 架構依賴管理

本專案使用 `eslint-plugin-boundaries` 來強制執行 Feature-Sliced Design (FSD) 架構的依賴規則。

## 架構層級

### 依賴規則（從上到下）

```
app         → 可以使用所有層級
  ↓
pages       → 可以使用 widgets, features, entities, shared
  ↓
widgets     → 可以使用 features, entities, shared
  ↓
features    → 可以使用 entities, shared
  ↓
entities    → 可以使用 entities (互相), shared
  ↓
shared      → 只能內部依賴
```

## 核心原則

1. **單向依賴流**：只能向下依賴，不能向上依賴
2. **同層隔離**：同層級的不同 slice 應該互相獨立（除了 entities）
3. **Public API**：通過 index 文件暴露公開接口

## 使用指令

```bash
# 檢查架構違規
pnpm lint

# 自動修復（限基本問題）
pnpm lint:fix
```

## 常見錯誤與解決方案

### ❌ 錯誤：`boundaries/element-types`

```typescript
// ❌ widgets 不能使用 pages
// src/renderer/widgets/MyWidget/index.tsx
import { SomePage } from "@/pages/SomePage";

// ✅ widgets 只能使用 features, entities, shared
import { SomeFeature } from "@/features/SomeFeature";
```

### ❌ 錯誤：`boundaries/no-unknown`

```typescript
// ❌ 從未定義的路徑導入
import { something } from "../../../some-random-folder";

// ✅ 使用定義好的層級
import { something } from "@/shared/lib/something";
```

### ❌ 錯誤：`boundaries/no-unknown-files`

檔案不在任何已定義的層級內。確保檔案在以下目錄之一：

- `src/renderer/app/`
- `src/renderer/pages/`
- `src/renderer/widgets/`
- `src/renderer/features/`
- `src/renderer/entities/`
- `src/renderer/shared/`

## 層級說明

### 📱 App Layer

應用的入口點和根配置

- 路由配置
- 全域 Provider
- 主題和樣式

### 📄 Pages Layer

完整的頁面組件

- 組合 widgets 和 features
- 處理路由
- 頁面級別的資料獲取

### 🧩 Widgets Layer

獨立的 UI 區塊

- 側邊欄、導航欄
- 複雜的複合組件
- 包含業務邏輯的 UI 組件

### ⚙️ Features Layer

業務功能和用戶操作

- 使用者互動（登入、搜尋等）
- 業務邏輯實現
- 狀態管理

### 📦 Entities Layer

業務實體

- API 客戶端
- 資料模型
- 實體級別的狀態管理

### 🔧 Shared Layer

可重用的基礎設施

- UI 組件庫
- 工具函數
- API 配置
- 型別定義

## 範例

### ✅ 正確的依賴

```typescript
// pages/Library/index.tsx
import { Sidebar } from "@/widgets/Sidebar"; // ✅ pages → widgets
import { useFiles } from "@/entities/fileSystem"; // ✅ pages → entities
import { Button } from "@/shared/ui/Button"; // ✅ pages → shared

// widgets/Sidebar/index.tsx
import { useAuth } from "@/features/auth"; // ✅ widgets → features
import { useUser } from "@/entities/user"; // ✅ widgets → entities

// features/auth/model.ts
import { userApi } from "@/entities/user/api"; // ✅ features → entities

// entities/user/api.ts
import { httpClient } from "@/shared/api/http"; // ✅ entities → shared
```

### ❌ 錯誤的依賴

```typescript
// ❌ shared 不能依賴 entities
// shared/ui/UserAvatar.tsx
import { useUser } from "@/entities/user";

// ❌ entities 不能依賴 features
// entities/user/model.ts
import { authFeature } from "@/features/auth";

// ❌ widgets 不能依賴 pages
// widgets/Header/index.tsx
import { LibraryPage } from "@/pages/Library";
```

## 暫時繞過規則（不推薦）

如果確實需要暫時繞過某個規則（僅在特殊情況下）：

```typescript
// eslint-disable-next-line boundaries/element-types
import { Something } from "@/wrong-layer";
```

**注意**：應該盡量避免這樣做，並在程式碼審查時特別注意這些繞過。

## 配置文件

ESLint 配置位於：`packages/desktop-client/eslint.config.js`

如需調整規則，請修改該文件並與團隊討論。
