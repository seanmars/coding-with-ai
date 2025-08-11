# 程式庫概覽

## 專案簡介

**coding-with-ai** 是一個用於 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 的 TypeScript/Node.js 狀態列工具程式。它透過 stdin 接受包含 session metadata 的 JSON 輸入，從 Claude Code transcript 檔案中讀取 git branch 資訊和 token 使用量指標，然後產生格式化且彩色化的狀態列輸出用於終端機顯示。

## 專案結構

```text
F:\workspace\dev\coding-with-ai\
├── src\                          # 原始碼目錄
│   ├── statusline.ts            # 主要進入點
│   ├── common.ts                # 核心功能模組
│   ├── types.ts                 # TypeScript 類型定義
│   └── commands\                # 指令模組
│       ├── installStatuslineCommand.tsx
│       ├── setupStatuslineCommand.tsx
│       ├── installAgentsCommand.tsx
│       └── installCommandsCommand.tsx
├── dist\                        # 建置輸出目錄
├── claude\                      # Claude 相關資源
│   ├── agents\                  # Claude 代理配置
│   └── commands\                # Claude 指令配置
├── res\                         # 資源檔案
├── package.json                 # 專案配置
├── vite.config.ts              # 建置配置
├── tsconfig.json               # TypeScript 配置
└── CLAUDE.md                   # Claude Code 指引文件
```

## 核心架構

### 主要檔案

#### 1. `src/statusline.ts` - 主要進入點

- 處理 stdin JSON 輸入並協調狀態列產生
- 實作 `waitingStdin()` 函數處理 CLI 輸入
- 整合所有功能模組產生最終的狀態列輸出

#### 2. `src/common.ts` - 核心功能模組

包含專案的主要功能實作：

**設定管理**

- `getConstAppValues()` - 取得應用程式常數值和路徑配置
- `loadStatuslineConfig()` - 載入狀態列設定檔案

**Git 整合**

- `getGitBranch()` - 執行 `git branch --show-current` 取得當前分支
- 使用 `execSync` 同步執行 Git 指令

**Claude Code 整合**

- `getClaudeVersion()` - 取得 Claude 版本資訊
- `getTokenMetrics()` - 解析 Claude Code transcript JSONL 檔案

**Token 指標處理**

- 解析 transcript 檔案提取 input/output/cached token 數量
- 從最新主鏈條目提取 context length 資訊
- 計算累積 token 使用量

**狀態列渲染**

- `renderStatusline()` - 產生彩色化狀態列輸出
- `hexToAnsi()` - 將 hex 顏色轉換為 ANSI 24-bit 顏色碼
- `colorText()` - 使用 ANSI 顏色碼包裝文字
- `normalizedNumber()` - 格式化大數字（如 1500 → "1.5k"）

#### 3. `src/types.ts` - TypeScript 類型定義

定義了完整的類型系統：

**Claude Code 介面**

- `ClaudeCodeStatus` - Claude Code session 狀態
- `TokenUsage` - Token 使用量介面
- `TranscriptLine` - Transcript 檔案行格式

**狀態列介面**

- `TokenMetrics` - Token 指標資料
- `RenderData` - 狀態列渲染資料
- `StatuslineConfig` - 狀態列設定
- `ClaudeCodeStatuslineElementType` - 支援的狀態列元素類型

#### 4. `src/commands/` - 指令模組目錄

使用 React + Ink 框架實作的互動式 CLI 指令：

**安裝指令**

- `installStatuslineCommand.tsx` - 狀態列安裝程式
- `installAgentsCommand.tsx` - 代理安裝程式
- `installCommandsCommand.tsx` - 指令安裝程式
- `setupStatuslineCommand.tsx` - 狀態列設定程式

### 狀態列元素

支援以下可設定的狀態列元素：

- **time** - 目前時間 (YYYY-MM-DD HH:MM) 🕒
- **cwd** - 目前工作目錄基底名稱 📂
- **model** - Model 顯示名稱
- **version** - Claude Code 版本資訊
- **git-branch** - 目前 git 分支 🌿
- **total-tokens** - 總 token 使用量
- **input-tokens** - 輸入 tokens
- **output-tokens** - 輸出 tokens
- **cached-tokens** - 快取 tokens
- **context-length** - 目前 context 視窗使用量

## 技術特色

### 建置系統

- **Vite** - 用於建置，輸出 ES modules 針對 Node.js 22
- **TypeScript** - 使用 ES2020 和 NodeNext 模組解析
- 外部依賴：`child_process`, `fs`, `util`, `path` (Node.js 內建模組)
- 輸出產物：帶有可執行 shebang 的 `dist/statusline.js`

### 顏色系統

- 支援 ANSI 24-bit 顏色與 hex 顏色
- 元素間使用 `|` 分隔，支援個別顏色自訂
- 自動正規化大數字顯示

### Token 指標處理

- 解析 Claude Code transcript 檔案（JSONL 格式）
- 提取 input/output/cached token 計數
- 從最新主鏈條目（非側鏈）提取 context length
- 計算跨 session 的累積 token 使用量

### 跨平台支援

- `getPathDirName()` - 跨平台路徑解析
- 支援 Windows、macOS 和 Linux 路徑格式

## 輸入/輸出流程

1. **輸入處理**：應用程式透過 stdin 接收 `ClaudeCodeStatus` 格式的 JSON 資料
2. **資料收集**：處理 transcript 檔案以提取 token 使用量指標
3. **Git 整合**：結合 git branch 資訊
4. **狀態列生成**：產生使用 ANSI 逃脫碼的彩色狀態輸出

## 開發指令

- `pnpm build` - 使用 Vite 建置專案
- `pnpm cc:statusline:install` - 安裝狀態列
- `pnpm cc:statusline:setup` - 設定狀態列
- `pnpm cc:agents:install` - 安裝代理
- `pnpm cc:commands:install` - 安裝指令

## 設定系統

- **預設設定目錄**：`~/.config/claude-code-statusline/`
- **Claude Code 目錄**：`~/.claude/`
- **設定檔案**：支援 JSON 格式的自訂設定
- **代理與指令**：可安裝至 Claude Code 官方目錄

## 授權與作者

- **授權**：MIT License
- **作者**：Sean Mars
- **版本**：1.0.0

這個專案展示了現代 TypeScript 開發的最佳實務，包括模組化架構、型別安全、跨平台相容性，以及與外部工具（Git、Claude Code）的無縫整合。透過使用 React + Ink 框架，提供了優雅的 CLI 使用者體驗。
