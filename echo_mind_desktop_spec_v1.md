# EchoMind（回音心智）軟體需求規格書（SRS）

**文件代號**：ECHOMIND-SRS

**版本**：v1.0

**最後更新**：2026-01-16

---

## 文件變更紀錄（Change Log）
| 版本 | 日期 | 變更內容 | 作者 |
|---|---|---|---|
| v1.0 | 2026-01-16 | 初版：技術棧、UI Flow、SRS、測試計劃整合 | 仁和黃 |

---

## 1. 系統概述（Overview）

### 1.1 產品定位
EchoMind 是一套 **離線優先（Offline-first）** 的桌面應用程式，針對「課堂錄音／會議錄音」提供：
1) 音檔匯入與管理
2) 本地 ASR 轉錄（含秒級時間戳）
3) 文本切塊與向量索引
4) 關鍵字／語意檢索
5) 一鍵跳轉至原音檔對應秒數播放

本系統核心目標是將原本難以管理與檢索的音檔資產，轉化成可檢索的知識資產（Audio Knowledge Management, Audio-KM）。

### 1.2 系統目標（Goals）
- **G1**：使用者可在 10 秒內透過搜尋定位到目標段落（而不是逐段聽找）
- **G2**：全功能離線可用（不依賴網路）
- **G3**：檢索結果可精準回跳到音檔位置（目標精度 ≤ 0.5 秒）
- **G4**：系統資料完全由使用者本機保存（privacy-by-default）

### 1.3 範圍（Scope）
#### In-scope（v1.0 / MVP）
- 音檔匯入（多檔）
- 音檔列表與狀態追蹤
- 本地 ASR（faster-whisper）
- Chunking + Embedding
- Semantic Search + Keyword Search
- 播放器（倍速、跳轉）
- 逐字稿檢視（點選文字跳轉播放）
- 基本設定（路徑、語言、模型）

#### Out-of-scope（不包含於 MVP）
- 雲端同步、跨裝置同步
- 雲端帳號／訂閱系統
- 多人協作／共享知識庫
- Speaker diarization（講者分離）
- RAG 聊天助手（可列為 V2）

### 1.4 定義與縮寫（Glossary）
- **ASR**：Automatic Speech Recognition
- **Chunk**：逐字稿片段化文字區塊，帶時間戳
- **Embedding**：文本向量表示
- **Vector Store / Vector Index**：向量索引（FAISS/LanceDB）
- **FTS5**：SQLite Full Text Search 5
- **Offline-first**：核心功能不依賴網路即可運作

---

## 2. 需求與限制（Assumptions & Constraints）

### 2.1 使用限制
- 使用者音檔與索引資料皆保存在本機。
- 若使用者設備資源有限（CPU/RAM），轉錄速度將受影響。

### 2.2 系統限制
- **MVP 不包含雲端**，因此裝置間資料不共享。
- **ASR/Embedding 模型需本地部署**，安裝包需包含 worker 或提供下載機制。

---

## 3. 技術棧（Tech Stack）

### 3.1 技術選型結論
系統採用 **內嵌瀏覽器核心（WebView）+ Web 技術**，以降低 UI 開發成本，並避免 Electron 帶來的體積與 runtime 負擔。

**推薦架構：Tauri v2 + Web UI + Rust Core + Python AI Worker**

### 3.2 組件與版本（建議）

#### UI / Presentation
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui（可選但推薦）
- 狀態管理：Zustand（輕量）或 Redux Toolkit（大型擴展）

#### Desktop Shell
- Tauri v2（OS WebView runtime）
  - Windows：WebView2
  - macOS：WKWebView

#### Application Core
- Rust（Tauri Commands）
  - Job Queue（可重試）
  - DB Repository 層
  - File system 管理
  - IPC orchestration

#### AI Worker
- Python 3.11+
  - ASR：faster-whisper
  - Embedding：sentence-transformers（可替換）
  - Chunking：自定規則（timestamp-based）

#### Storage
- SQLite（metadata / transcript / notes）
- SQLite FTS5（keyword search）
- Vector index：
  - MVP：FAISS
  - V1（可選）：LanceDB
- File system：Audio、Cache、Models

#### Packaging
- Tauri Bundler
- Python Worker：PyInstaller（Win/macOS）

---

## 4. 系統架構（Architecture）

### 4.1 邏輯架構
- **UI Layer（Web）**：呈現與互動
- **Core Layer（Rust）**：流程控制、資料一致性、DB/FS 存取
- **AI Worker（Python）**：ASR / embedding / indexing

### 4.2 主要資料流（Data Flow）
1. Import audio → 建立 AudioAsset（IMPORTED）
2. Core enqueue job → ASR（TRANSCRIBING）
3. ASR 產生 segments → 寫入 DB（TRANSCRIBED）
4. Chunking + embedding → 寫入 vector index（INDEXING → READY）
5. Query → semantic/keyword search → 顯示結果 → jump-to-timestamp

---

## 5. UI Flow（頁面規格）

### 5.1 IA（Information Architecture）
側邊欄（SideNav）：
- Library
- Search
- Player
- Notes
- Settings

### 5.2 頁面清單
#### P1. Welcome / Initialization
- 建立 local profile
- 指定資料儲存路徑
- 設定 ASR 語言與模型

#### P2. Library
- 音檔列表、狀態 badge
- Upload audio（多檔）
- Retry failed jobs

#### P3. Search
- Keyword/Semantic 切換
- Scope：All / folder / tag
- Results：timestamp + snippet + score

#### P4. Player
- Audio playback（play/pause/seek/speed）
- Transcript viewer（click-to-jump）

#### P5. Notes
- timestamp notes list
- click note → jump audio

#### P6. Settings
- storage path
- ASR/embedding preferences
- theme/font

---

## 6. 功能需求（Functional Requirements）

### 6.1 Audio Asset 管理
**FR-AUD-001**：支援匯入多音檔（拖拉/檔案選取）
- Input：mp3/wav/m4a
- Output：建立 AudioAsset

**FR-AUD-002**：顯示音檔狀態
- 狀態需與 state machine 一致

**FR-AUD-003**：支援刪除音檔（MVP：hard delete）

### 6.2 ASR（轉錄）
**FR-ASR-001**：以 faster-whisper 完成本地轉錄
- Output：segments（start_sec, end_sec, text）

**FR-ASR-002**：轉錄參數可配置
- default language
- model size

### 6.3 Chunking + Embedding
**FR-EMB-001**：依 timestamp 進行 chunking
- chunk duration：15–45 秒（可配置）

**FR-EMB-002**：對每個 chunk 建立 embedding 並寫入向量索引

### 6.4 Search
**FR-SRC-001**：Keyword Search
- SQLite FTS5

**FR-SRC-002**：Semantic Search
- Query embedding
- Vector similarity topK

**FR-SRC-003**：Search result 顯示
- filename
- timestamp range
- snippet
- relevance score

### 6.5 Player / Study
**FR-PLY-001**：播放控制
- play/pause/seek
- speed：0.5x–2.5x

**FR-PLY-002**：Transcript viewer
- 點擊任一行 → seek to start_sec

### 6.6 Notes（V1 可擴充）
**FR-NOT-001**：新增 timestamp note

---

## 7. 非功能需求（Non-Functional Requirements）

### 7.1 效能
- Semantic search < 500ms（在 10k chunks）
- UI 不因 ASR 卡頓（worker 分離）

### 7.2 可靠性
- 任何 job failure 必須可 retry
- crash 後可重新載入狀態（DB 為 source of truth）

### 7.3 安全與隱私
- 預設不將音檔上傳
- 日誌不得寫入音檔全文內容（可寫 metadata）

---

## 8. 資料模型與 DB 規格（SQLite）

### 8.1 audio_assets
- id TEXT PK
- file_path TEXT NOT NULL
- file_name TEXT NOT NULL
- duration_sec REAL
- status TEXT NOT NULL
- created_at TEXT NOT NULL
- updated_at TEXT NOT NULL

### 8.2 transcript_segments
- id TEXT PK
- audio_id TEXT NOT NULL
- start_sec REAL NOT NULL
- end_sec REAL NOT NULL
- text TEXT NOT NULL

### 8.3 chunks
- id TEXT PK
- audio_id TEXT NOT NULL
- start_sec REAL NOT NULL
- end_sec REAL NOT NULL
- chunk_text TEXT NOT NULL
- vector_row_id INTEGER

### 8.4 notes（optional / V1）
- id TEXT PK
- audio_id TEXT NOT NULL
- timestamp_sec REAL NOT NULL
- content TEXT NOT NULL
- created_at TEXT NOT NULL

---

## 9. 狀態機（State Machine）

### 9.1 AudioAssetStatus
- IMPORTED
- TRANSCRIBING
- TRANSCRIBED
- INDEXING
- READY
- FAILED_TRANSCRIBE
- FAILED_INDEX

### 9.2 合法轉移
- IMPORTED → TRANSCRIBING
- TRANSCRIBING → TRANSCRIBED | FAILED_TRANSCRIBE
- TRANSCRIBED → INDEXING
- INDEXING → READY | FAILED_INDEX
- FAILED_* → TRANSCRIBING（retry）

---

## 10. IPC 規格（Core ↔ Python Worker）

### 10.1 共通回應
```json
{ "ok": true, "data": { } }
```
```json
{ "ok": false, "error_code": "...", "message": "..." }
```

### 10.2 transcribe
Input
```json
{ "audio_id": "...", "file_path": "...", "lang": "zh-TW" }
```
Output
```json
{ "ok": true, "data": { "segments": [{"start_sec":0.0,"end_sec":1.2,"text":"..."}] } }
```

### 10.3 embed
Input
```json
{ "audio_id": "...", "chunks": [{"chunk_id":"...","text":"..."}] }
```
Output
```json
{ "ok": true, "data": { "vectors": [{"chunk_id":"...","vector":[...]}] } }
```

---

## 11. 測試計劃（Test Plan）

### 11.1 測試層級
1. Unit Test
2. Integration Test
3. E2E Test
4. Performance Test
5. Reliability / Recovery Test

### 11.2 Unit Tests
- Rust：DB repo, state machine, job queue
- Python：ASR schema, chunking, embedding dimension

### 11.3 Integration Tests
- Import → ASR → index
- Query → result mapping
- Jump timestamp correctness

### 11.4 E2E（Playwright）
Scenario：
1) upload
2) wait READY
3) search query
4) click result
5) verify seek

### 11.5 Performance
- dataset：100 files / 10k chunks
- KPI：semantic search < 500ms

### 11.6 Reliability
- kill worker during ASR → retry
- corrupt index → rebuild

---

## 12. Definition of Done（DoD）
- MVP 主要流程皆可完成且可重試
- 無網路情境下可完整使用
- 可觀測性：log/error code 完整

