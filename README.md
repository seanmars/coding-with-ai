# Claude Code Statusline

A TypeScript/Node.js utility that generates colorized status line output for [Claude Code](https://docs.anthropic.com/en/docs/claude-code/statusline#create-a-custom-status-line) terminals. This tool reads session metadata via stdin, extracts token usage metrics from Claude Code transcript files, and displays formatted status information including git branch, model details, and token usage statistics.

## Features

- **Git Integration**: Displays current git branch with branch emoji
- **Token Metrics**: Shows input/output/cached tokens and context length from Claude Code transcripts
- **Colorized Output**: ANSI 24-bit color support with customizable hex colors
- **Session Info**: Displays current model, workspace directory, and version information
- **Cross-platform**: Works on Windows, macOS, and Linux

## Installation

### Prerequisites

- Node.js 22 or higher
- pnpm package manager

### Install Dependencies

```bash
pnpm install
```

This creates `dist/statusline.js` with a Node.js shebang for Claude Code Hook.

## Usage

## Build the statusline script

```bash
pnpm build
```

### Setup the statusline

```bash
pnpm cc:setup
```

### Install the statusline

```bash
pnpm cc:install
```

### Input Format

The application expects a JSON object with the following structure:

```typescript
interface ClaudeCodeStatus {
  transcript_path: string;
  model: { display_name: string };
  workspace: {
    current_dir: string;
    project_dir: string;
  };
  cwd: string;
  // ... other fields
}
```

### Output Elements

The statusline includes the following configurable elements:

- **time** - Current time in HH:MM format 🕒
- **cwd** - Current working directory basename 📁
- **model** - Model display name 🤖
- **git-branch** - Current git branch 🌿
- **total-tokens** - Total token usage 🔢
- **input-tokens** - Input tokens consumed 📥
- **output-tokens** - Output tokens generated 📤
- **cached-tokens** - Cached tokens utilized 💾
- **context-length** - Current context window usage 📏
- **version** - Claude Code version ℹ️

## Configuration

The statusline elements and their colors are currently hardcoded in `src/statusline.ts`. Each element can be customized with:

- **type** - Element type from the available list above
- **color** - Hex color code for ANSI 24-bit terminal colors

## License

MIT
