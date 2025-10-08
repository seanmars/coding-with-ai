# Coding With AI

一個專為 Claude Code 設計的終端狀態列顯示工具，能夠顯示會話資訊、git 分支、token 使用統計等資訊，並提供彩色化輸出。

## 專案概述

Coding With AI 是一個 TypeScript/Node.js 專案，用於為 Claude Code 提供豐富的狀態列顯示功能。此工具透過 stdin 接收 JSON 格式的會話元資料，讀取 git 分支資訊和 Claude Code transcript 檔案中的 token 使用統計，然後生成格式化的彩色終端輸出。

### 主要功能

- 📊 **Token 使用統計**：顯示輸入、輸出、快取 token 數量和總計
- 🌿 **Git 分支資訊**：自動檢測並顯示當前 git 分支
- ⏰ **時間顯示**：顯示當前日期和時間
- 📂 **工作目錄**：顯示當前工作目錄名稱
- 🤖 **模型資訊**：顯示正在使用的 Claude 模型
- 🎨 **彩色化輸出**：支援 24-bit ANSI 色彩和自定義色彩配置
- ⚙️ **可配置**：透過配置檔案自定義顯示元素和色彩

## 安裝與設定

### 系統需求

- Node.js 22 或更新版本
- pnpm 套件管理器
- Git（用於分支資訊顯示）
- Claude Code CLI v1.0.71+（支援狀態列功能）

### 快速安裝

1. **複製專案**

```bash
git clone <repository-url>
cd coding-with-ai
```

2. **安裝相依性**

```bash
pnpm install
```

3. **建置專案**

```bash
pnpm build
```

4. **安裝狀態列到 Claude Code**

```bash
pnpm run cc:statusline:install
```

5. **設定狀態列配置**

```bash
pnpm run cc:statusline:setup
```

### 手動安裝

如果您偏好手動安裝，可以依照以下步驟：

1. 建置專案後，將 `dist/statusline.js` 複製到 `~/.claude/` 目錄
2. 在 `~/.claude/settings.json` 中設定狀態列配置：

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/statusline.js",
    "padding": 0
  }
}
```

## 使用方法

### 基本使用

狀態列工具設計為透過 stdin 接收 JSON 資料：

```bash
echo '{"session_id":"...","transcript_path":"...","cwd":"...","model":{"id":"...","display_name":"..."},"workspace":{"current_dir":"...","project_dir":"..."}}' | node statusline.js
```

### 輸入資料格式

工具期望接收符合 `ClaudeCodeStatus` 介面的 JSON 資料：

```typescript
interface ClaudeCodeStatus {
  hook_event_name: string;
  session_id: string;
  transcript_path: string;
  cwd: string;
  model: {
    id: string;
    display_name: string;
  };
  workspace: {
    current_dir: string;
    project_dir: string;
  };
  version: string;
  output_style: {
    name: string;
  };
  cost: {
    total_cost_usd: number;
    total_duration_ms: number;
    total_api_duration_ms: number;
    total_lines_added: number;
    total_lines_removed: number;
  };
}
```

### 輸出範例

```
🕒 2025-08-21 14:41 | 📂 coding-with-ai | Sonnet 4 | 🌿 main | Total: 269.78k | In: 71 | Out: 2.66k | Cached: 267.06k | Ctx: 27.84k | Ver: 1.0.86 | 💵 0.352304 | ⌛ 01:45 | 📜 default
```

### Claude Code 1.0.71+ 狀態列整合

從 Claude Code v1.0.71 開始，您可以使用 `/statusline` 指令直接在 Claude Code 中設定自定義狀態列：

1. 在 Claude Code 中執行 `/statusline` 指令
2. 選擇 "Custom command" 選項
3. 輸入您的狀態列指令路徑（例如：`node ~/.claude/statusline.js`）
4. 狀態列將自動整合到 Claude Code 介面中

## 配置設定

### 狀態列配置

狀態列的顯示元素和色彩可以透過配置檔案自定義。配置檔案位於：

- 使用者配置：`~/.config/claude-code-statusline/config.json`
- 預設配置：專案根目錄的 `defaultConfig.json`

### 預設配置

```json
{
  "elements": [
    {
      "type": "time",
      "color": "#F8E71C"
    },
    {
      "type": "cwd",
      "color": "#4A90E2"
    },
    {
      "type": "model",
      "color": "#7ED321"
    },
    {
      "type": "git-branch",
      "color": "#F5A623"
    },
    {
      "type": "total-tokens",
      "color": "#D0021B"
    },
    {
      "type": "input-tokens",
      "color": "#9013FE"
    },
    {
      "type": "output-tokens",
      "color": "#50E3C2"
    },
    {
      "type": "cached-tokens",
      "color": "#BD10E0"
    },
    {
      "type": "context-length",
      "color": "#B8E986"
    },
    {
      "type": "version",
      "color": "#FFFFFF"
    },
    {
      "type": "cost",
      "color": "#F8E71C"
    },
    {
      "type": "duration",
      "color": "#4A90E2"
    },
    {
      "type": "output_style",
      "color": "#7ED321"
    }
  ]
}
```

### 支援的元素類型

| 類型             | 描述              | 顯示格式               |
| ---------------- | ----------------- | ---------------------  |
| `time`           | 當前日期和時間    | `🕒 2025-08-12 14:30` |
| `cwd`            | 當前工作目錄名稱  | `📂 project-name`     |
| `model`          | Claude 模型名稱   | `Sonnet 4`            |
| `version`        | Claude Code 版本  | `Ver: 1.0.85`         |
| `git-branch`     | Git 分支名稱      | `🌿 main`             |
| `total-tokens`   | 總 token 數量     | `Total: 2.5k`         |
| `input-tokens`   | 輸入 token 數量   | `In: 1.8k`            |
| `output-tokens`  | 輸出 token 數量   | `Out: 0.7k`           |
| `cached-tokens`  | 快取 token 數量   | `Cached: 0.3k`        |
| `context-length` | 當前 context 長度 | `Ctx: 1.2k`           |
| `cost`           | 當前請求成本      | `💵 0.352304`         |
| `duration`       | 當前請求持續時間  | `⌛ 01:45`            |
| `output_style`   | 當前輸出樣式      | `📜 default`          |

## 專案架構

參考 [程式庫概覽](./codebase-overview.md) 獲取專案結構和檔案說明。

## 開發指南

### 建置配置

- 使用 Vite 進行建置，輸出 ES modules 目標為 Node.js 22
- TypeScript 配置目標為 ES2020，使用 NodeNext 模組解析
- 外部相依性：`child_process`、`fs`、`util`（Node.js 內建模組）
- 輸出目錄：`dist/`
- 主要建置產物：`statusline.js`，包含可執行的 shebang
- Rollup 配置為 CLI 使用添加 `#!/usr/bin/env node` banner

### 開發流程

1. **修改源碼**：編輯 `src/` 目錄下的 TypeScript 檔案
2. **建置專案**：執行 `pnpm build` 編譯 TypeScript 至 `dist/statusline.js`
3. **測試**：可以使用測試資料透過 pipe 測試功能
4. **安裝**：執行相關安裝指令將更新後的工具安裝到 Claude Code

### 測試

建置完成後，您可以使用測試資料來驗證功能：

```bash
echo '{"session_id":"test","transcript_path":"/path/to/transcript.jsonl","cwd":"/current/dir","model":{"id":"sonnet-4","display_name":"Sonnet 4"},"workspace":{"current_dir":"/workspace","project_dir":"/project"}}' | node dist/statusline.js
```

## 輸入/輸出流程

1. **輸入處理**：應用程式透過 stdin 接收 JSON 格式的會話元資料
2. **資料擷取**：
   - 解析 transcript 檔案取得 token 使用統計
   - 執行 git 指令取得分支資訊
   - 載入使用者配置或使用預設配置
3. **狀態列生成**：
   - 根據配置生成各個狀態元素
   - 應用 ANSI 色彩代碼
   - 組合成最終的狀態列字串
4. **輸出**：將彩色化的狀態列輸出到 stdout

## 故障排除

### 常見問題

**Q: 狀態列沒有顯示？**  
A: 確認已正確安裝並設定 `~/.claude/settings.json`，且 `statusline.js` 檔案存在於正確位置。

**Q: Git 分支資訊顯示為 "?"？**  
A: 確認當前目錄是一個 git repository，且 git 指令可以正常執行。

**Q: Token 統計顯示為 0？**  
A: 檢查 transcript 檔案路徑是否正確，且檔案格式為有效的 JSONL。

**Q: 色彩沒有顯示？**  
A: 確認您的終端支援 24-bit 色彩（大多數現代終端都支援）。

### 除錯

如果遇到問題，可以：

1. 檢查建置是否成功：`ls -la dist/statusline.js`
2. 手動測試工具：使用測試資料透過 pipe 測試
3. 檢查配置檔案：確認 JSON 格式正確
4. 查看錯誤訊息：狀態列會將錯誤訊息輸出到 stderr

## 貢獻指南

歡迎貢獻！請遵循以下指南：

1. Fork 此 repository
2. 建立功能分支：`git checkout -b feature/amazing-feature`
3. 遵循 TypeScript 和程式碼風格規範
4. 確保所有測試通過
5. 提交您的變更：`git commit -m 'Add amazing feature'`
6. 推送到分支：`git push origin feature/amazing-feature`
7. 開啟 Pull Request

### 開發規則

- 所有程式碼檔案使用 TypeScript
- 所有指令需要使用 `ink` 和 `ink-select-input` 元件實作使用者互動
- 完成功能或修復 bug 後，請進行測試

### 版本相容性

本專案與以下 Claude Code 版本相容：

- **v1.0.71+**: 完整支援 `/statusline` 指令整合
- **v1.0.0-v1.0.70**: 需要手動設定 `~/.claude/settings.json`
- **v0.x**: 部分功能可能不相容，建議升級至 v1.0+

## 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](./LICENSE) 檔案。
