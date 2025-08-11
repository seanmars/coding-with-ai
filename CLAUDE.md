# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript/Node.js project that provides a statusline utility for Claude Code. It accepts JSON input via stdin containing session metadata, reads git branch information and token usage metrics from Claude Code transcript files, then generates formatted, colorized status line output for terminal display.

## Rules

- Use TypeScript for all code files
- IMPORTANT: All commands need to use ink, ink-select-input component to implement user interactions
- IMPORTANT: After completing a feature or bug fix, test it.

## Development Commands

- `pnpm build` - Build the project using Vite (outputs to `dist/statusline.js`)
- Build creates an executable with shebang `#!/usr/bin/env node`
- Test utility: `tsx test-getPathDirName.ts` - Test path parsing functionality

## Architecture

The project follows a modular TypeScript structure:

### Core Files

- `src/statusline.ts` - Main entry point that processes stdin JSON input and orchestrates statusline generation
- `src/common.ts` - Core functionality including git operations, token metrics parsing, and ANSI color utilities
- `src/types.ts` - TypeScript interfaces and type definitions for Claude Code status data

### Key Functions

- `getGitBranch()` - Executes `git branch --show-current` to get current branch
- `getTokenMetrics(transcriptPath)` - Parses Claude Code transcript JSONL files to extract token usage metrics
- `renderStatusline(data)` - Renders colorized statusline with configurable elements and ANSI color codes
- `getPathDirName(path)` - Cross-platform path parsing to extract directory names from full paths
- `waitingStdin()` - Handles reading JSON input from stdin for CLI usage

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

## Color System

- `hexToAnsi(hex)` - Converts hex colors to ANSI 24-bit color codes
- `colorText(text, color)` - Wraps text with ANSI color codes and reset sequences
- `normalizedNumber(num)` - Formats large numbers with 'k' suffix (e.g., 1500 → "1.5k")
- Elements are separated by `|` and support individual color customization
