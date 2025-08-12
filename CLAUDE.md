# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript/Node.js project that provides a statusline utility and setup commands for Claude Code. The main statusline utility accepts JSON input via stdin containing session metadata, reads git branch information and token usage metrics from Claude Code transcript files, then generates formatted, colorized status line output for terminal display. The project also includes interactive installation and configuration commands built with React/Ink.

## Rules

- Use TypeScript for all code files
- IMPORTANT: All commands need to use ink, ink-select-input component to implement user interactions
- IMPORTANT: After completing a feature or bug fix, test it.

## Development Commands

- `pnpm build` - Build the project using Vite (outputs to `dist/statusline.js`)
- `pnpm run cc:statusline:install` - Install statusline to Claude Code (interactive)
- `pnpm run cc:statusline:setup` - Configure statusline elements and colors (interactive)
- `pnpm run cc:agents:install` - Install agents to Claude Code
- `pnpm run cc:agents:clone` - Clone agents from repository
- `pnpm run cc:commands:install` - Install commands to Claude Code
- Build creates an executable with shebang `#!/usr/bin/env node`

## Architecture

The project follows a modular TypeScript structure with two main parts:

### Core Statusline Files

- `src/statusline.ts` - Main entry point that processes stdin JSON input and orchestrates statusline generation
- `src/common.ts` - Core functionality including git operations, token metrics parsing, ANSI color utilities, and configuration management
- `src/types.ts` - TypeScript interfaces and type definitions for Claude Code status data

### Interactive Commands

- `src/commands/` - Directory containing React/Ink interactive CLI commands:
  - `installStatuslineCommand.tsx` - Interactive installer for statusline to Claude Code
  - `setupStatuslineCommand.tsx` - Interactive configuration editor for statusline elements and colors
  - `installAgentsCommand.tsx` - Agent installation utilities
  - `cloneAgentsCommand.tsx` - Agent cloning functionality
  - `installCommandsCommand.tsx` - Command installation utilities

### Key Functions

- `getGitBranch()` - Executes `git branch --show-current` to get current branch
- `getTokenMetrics(transcriptPath)` - Parses Claude Code transcript JSONL files to extract token usage metrics
- `renderStatusline(data)` - Renders colorized statusline with configurable elements and ANSI color codes
- `getPathDirName(path)` - Cross-platform path parsing to extract directory names from full paths
- `waitingStdin()` - Handles reading JSON input from stdin for CLI usage
- `getConstAppValues()` - Returns standard paths for Claude Code directories and configuration
- `loadStatuslineConfig(configPath)` - Loads user or default statusline configuration

### Token Metrics Processing

The `getTokenMetrics` function parses Claude Code transcript files (`.jsonl` format) to extract:

- Input/output/cached token counts
- Context length from most recent main chain entry (non-sidechain)
- Total cumulative token usage across the session

### Statusline Elements

Configurable statusline elements include:

- `time` - Current time in HH:MM format with clock emoji
- `cwd` - Current working directory basename with folder emoji
- `model` - Model display name from Claude Code session data
- `version` - Claude Code version information
- `git-branch` - Current git branch with branch emoji
- `total-tokens`, `input-tokens`, `output-tokens`, `cached-tokens` - Token usage metrics with normalized display (e.g., "1.5k")
- `context-length` - Current context window usage from most recent main chain entry

## Build Configuration

- Uses Vite for building with ES modules output targeting Node.js 22
- TypeScript configuration targets ES2020 with NodeNext module resolution
- External dependencies: `child_process`, `fs`, `util` (Node.js built-ins)
- Output directory: `dist/`
- Main build artifact: `statusline.js` with executable shebang
- Rollup configuration adds `#!/usr/bin/env node` banner for CLI usage

## Input/Output Flow

The application expects JSON input via stdin with the following structure:

- `ClaudeCodeStatus` interface defines the expected input format
- Contains session metadata including transcript path, model info, workspace details
- Processes the transcript file to extract token usage metrics
- Combines with git branch information to generate colorized status output
- Uses ANSI escape codes for terminal color formatting with hex color support

## Configuration System

The project uses a two-tier configuration system:

- **Default Configuration**: `defaultConfig.json` - Provides fallback values for statusline elements
- **User Configuration**: `~/.config/claude-code-statusline/config.json` - User-specific overrides
- **Claude Code Integration**: `~/.claude/settings.json` - Claude Code statusline configuration
- **Built Statusline**: `~/.claude/statusline.js` - The actual executable installed for Claude Code

### Configuration Structure

Each statusline element has:
- `type`: Element type (time, cwd, model, git-branch, etc.)
- `color`: Hex color code for ANSI terminal coloring

## Color System

- `hexToAnsi(hex)` - Converts hex colors to ANSI 24-bit color codes
- `colorText(text, color)` - Wraps text with ANSI color codes and reset sequences
- `normalizedNumber(num)` - Formats large numbers with 'k' suffix (e.g., 1500 → "1.5k")
- Elements are separated by `|` and support individual color customization

## Installation Flow

1. **Build**: `pnpm build` creates executable `dist/statusline.js`
2. **Install**: `pnpm run cc:statusline:install` copies built file to `~/.claude/statusline.js` and updates `~/.claude/settings.json`
3. **Configure**: `pnpm run cc:statusline:setup` provides interactive configuration for statusline elements and colors
4. **Integration**: Claude Code automatically uses the configured statusline for session display
