# Claude Code Statusline

一個 TypeScript/Node.js 工具程式，為 [Claude Code](https://docs.anthropic.com/en/docs/claude-code/statusline#create-a-custom-status-line) 終端機產生彩色狀態列輸出。此工具透過 stdin 讀取 session metadata，從 Claude Code transcript 檔案中擷取 token 使用量指標，並顯示格式化的狀態資訊，包括 git branch、model 詳細資訊和 token 使用統計。

## 功能特色

- **Git 整合**：顯示目前的 git branch 並附帶分支 emoji
- **Token 指標**：顯示來自 Claude Code transcripts 的 input/output/cached tokens 和 context length
- **彩色輸出**：支援 ANSI 24-bit 顏色和可自訂的 hex 顏色
- **Session 資訊**：顯示目前的 model、workspace 目錄和版本資訊
- **跨平台**：支援 Windows、macOS 和 Linux

## 安裝

### 前置需求

- Node.js 22 或更高版本
- pnpm package manager

### 安裝相依套件

```bash
pnpm install
```

這會建立帶有 Node.js shebang 的 `dist/statusline.js` 檔案，在 Claude Code Hook 中使用。

## 使用方式

## 建置 statusline script

```bash
pnpm build
```

### 設定 statusline

```bash
pnpm cc:setup
```

### 安裝 statusline

```bash
pnpm cc:install
```

### 輸入格式

應用程式預期接收以下結構的 JSON 物件：

```typescript
interface ClaudeCodeStatus {
  transcript_path: string;
  model: { display_name: string };
  workspace: {
    current_dir: string;
    project_dir: string;
  };
  cwd: string;
  // ... 其他欄位
}
```

### 輸出元素

statusline 包含以下可設定的元素：

- **time** - 目前時間，格式為 HH:MM 🕒
- **cwd** - 目前工作目錄的基底名稱 📁
- **model** - Model 顯示名稱 🤖
- **git-branch** - 目前的 git branch 🌿
- **total-tokens** - 總 token 使用量 🔢
- **input-tokens** - 消耗的 input tokens 📥
- **output-tokens** - 產生的 output tokens 📤
- **cached-tokens** - 使用的 cached tokens 💾
- **context-length** - 目前的 context window 使用量 📏
- **version** - Claude Code 版本 ℹ️

## 設定

statusline 元素及其顏色目前在 `src/statusline.ts` 中硬編碼。每個元素都可以透過以下方式自訂：

- **type** - 從上述可用清單中選擇元素類型
- **color** - 用於 ANSI 24-bit 終端機顏色的 Hex 色碼

## 授權

MIT
