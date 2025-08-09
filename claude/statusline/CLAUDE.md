# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript/Node.js project that provides a statusline utility for Claude Code. It reads git branch information and token usage metrics from Claude Code transcript files to generate formatted status line output.

## Development Commands

- `pnpm dev` - Run the main script in development mode using tsx
- `pnpm build` - Build the project using Vite (outputs to `dist/ccstatusline.js`)
- `pnpm start` - Run the built application from dist

## Architecture

The project follows a modular TypeScript structure:

### Core Files
- `src/ccstatusline.ts` - Main entry point that demonstrates usage
- `src/common.ts` - Core functionality including git operations and token metrics parsing
- `src/types.ts` - TypeScript interfaces and type definitions

### Key Functions
- `getGitBranch()` - Executes `git branch --show-current` to get current branch
- `getTokenMetrics(transcriptPath)` - Parses Claude Code transcript JSONL files to extract token usage
- `renderStatusline(elements, metrics, branch)` - Renders formatted statusline with configurable elements

### Token Metrics Processing
The `getTokenMetrics` function parses Claude Code transcript files (`.jsonl` format) to extract:
- Input/output/cached token counts
- Context length from most recent main chain entry (non-sidechain)
- Total cumulative token usage across the session

### Statusline Elements
Configurable statusline elements include:
- `cwd` - Current working directory
- `model` - Model name (hardcoded to "Claude")
- `git-branch` - Current git branch
- `total-tokens`, `input-tokens`, `output-tokens`, `cached-tokens` - Token usage metrics
- `context-length` - Current context window usage

## Build Configuration

- Uses Vite for building with ES modules output
- TypeScript configuration targets ES2020 with NodeNext module resolution
- Output directory: `dist/`
- Main build artifact: `ccstatusline.js`

## Usage Pattern

The main script currently demonstrates usage by:
1. Getting current git branch
2. Reading token metrics from a hardcoded transcript path
3. Rendering a statusline with specified elements
4. Outputting results to console

The transcript path in `ccstatusline.ts:11` should be updated to match actual Claude Code transcript locations for your use case.