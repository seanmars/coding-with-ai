import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import {
  TokenMetrics,
  TranscriptLine,
  RenderData,
  StatuslineConfig,
} from './types.js'

export const getConstAppValues = () => {
  // Claude Code official global configuration directory
  const CLAUDE_CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', '.claude');
  const CLAUDE_AGENTS_DIR = path.join(CLAUDE_CONFIG_DIR, 'agents');
  const CLAUDE_COMMANDS_DIR = path.join(CLAUDE_CONFIG_DIR, 'commands');

  // Define the base configuration directory on {user folder}/.config/claude-code-statusline
  const MY_STATUSLINE_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', '.config', 'claude-code-statusline');
  const MY_STATUSLINE_CONFIG_PATH = path.join(MY_STATUSLINE_DIR, 'config.json');

  return {
    claudeCodeDir: CLAUDE_CONFIG_DIR,
    claudeCodeAgentsDir: CLAUDE_AGENTS_DIR,
    claudeCodeCommandsDir: CLAUDE_COMMANDS_DIR,
    userStatuslineDir: MY_STATUSLINE_DIR,
    userStatuslineConfigPath: MY_STATUSLINE_CONFIG_PATH
  };
}

export function getPathDirName(path: string): string {
  if (!path) {
    return '';
  }

  const normalizedPath = path.replace(/\\/g, '/');
  const parts = normalizedPath.split('/').filter(part => part.length > 0);
  return parts.length > 0 ? parts[parts.length - 1] : path;
}

export async function loadStatuslineConfig(configPath: string): Promise<StatuslineConfig> {
  const defaultConfig: StatuslineConfig = {
    elements: [
      { type: 'time', color: '#F8E71C' },
      { type: 'cwd', color: '#4A90E2' },
      { type: 'model', color: '#7ED321' },
      { type: 'git-branch', color: '#F5A623' },
      { type: 'total-tokens', color: '#D0021B' },
      { type: 'input-tokens', color: '#9013FE' },
      { type: 'output-tokens', color: '#50E3C2' },
      { type: 'cached-tokens', color: '#BD10E0' },
      { type: 'context-length', color: '#B8E986' },
      { type: 'version', color: '#FFFFFF' },
      { type: 'cost', color: '#F8E71C' },
      { type: 'duration', color: '#4A90E2' },
      { type: 'output-style', color: '#7ED321' }
    ]
  };

  try {
    if (!fs.existsSync(configPath)) {
      return defaultConfig;
    }

    const configContent = await fs.promises.readFile(configPath, 'utf-8');
    const config: StatuslineConfig = JSON.parse(configContent);

    if (!config.elements || !Array.isArray(config.elements)) {
      return defaultConfig;
    }

    return config;
  } catch (error) {
    return defaultConfig;
  }
}

export function getGitBranch(): Promise<string | null> {
  try {
    const branch = execSync('git branch --show-current', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    return Promise.resolve(branch || null);
  } catch {
    return Promise.resolve(null);
  }
}

export function getClaudeVersion(): Promise<string | null> {
  try {
    const version = execSync('claude -v',
      {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      })
      .split(' ')[0]
      .trim();
    return Promise.resolve(version || null);
  } catch {
    return Promise.resolve(null);
  }
}

export async function getTokenMetrics(transcriptPath: string): Promise<TokenMetrics> {
  try {
    if (!fs.existsSync(transcriptPath)) {
      return { inputTokens: 0, outputTokens: 0, cachedTokens: 0, totalTokens: 0, contextLength: 0 };
    }

    const content = await fs.promises.readFile(transcriptPath, 'utf-8');
    const logs = content.trim().split('\n');

    let inputTokens = 0;
    let outputTokens = 0;
    let cachedTokens = 0;
    let contextLength = 0;

    let mostRecentMainChainEntry: TranscriptLine | null = null;
    let mostRecentTimestamp: Date | null = null;

    for (const line of logs) {
      try {
        const data: TranscriptLine = JSON.parse(line);
        if (data.message?.usage) {
          inputTokens += data.message.usage.input_tokens || 0;
          outputTokens += data.message.usage.output_tokens || 0;
          cachedTokens += data.message.usage.cache_read_input_tokens || 0;
          cachedTokens += data.message.usage.cache_creation_input_tokens || 0;

          if (data.isSidechain !== true && data.timestamp) {
            const entryTime = new Date(data.timestamp);
            if (!mostRecentTimestamp || entryTime > mostRecentTimestamp) {
              mostRecentTimestamp = entryTime;
              mostRecentMainChainEntry = data;
            }
          }
        }
      } catch {
        continue;
      }
    }

    if (mostRecentMainChainEntry?.message?.usage) {
      const usage = mostRecentMainChainEntry.message.usage;
      contextLength = (usage.input_tokens || 0) +
        (usage.cache_read_input_tokens || 0) +
        (usage.cache_creation_input_tokens || 0);
    }

    const totalTokens = inputTokens + outputTokens + cachedTokens;

    return { inputTokens, outputTokens, cachedTokens, totalTokens, contextLength };
  } catch {
    return { inputTokens: 0, outputTokens: 0, cachedTokens: 0, totalTokens: 0, contextLength: 0 };
  }
}

export const renderStatusline = async (data: RenderData): Promise<string> => {
  try {
    const separator = ' | ';
    const statusline: string[] = [];

    for (const element of data.elements) {
      const eleType = element.type;
      const eleClr = element.color || '#FFFFFF';

      switch (eleType) {
        case 'time':
          {
            const now = new Date();

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const timeStr = now.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: 'h24'
            });
            const text = `🕒 ${dateStr} ${timeStr}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'cwd':
          {
            const dir = getPathDirName(data.workspace.currentDir);
            const text = `📂 ${dir}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'model':
          {
            const text = `${data.modelName}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'version':
          {
            const version = !!data.version ? data.version : 'Unknown';
            const text = `Ver: ${version}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'git-branch':
          {
            const text = `🌿 ${data.gitBranch || '?'}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'total-tokens':
          {
            const text = `Total: ${normalizedNumber(data.tokenMetrics.totalTokens || 0)}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'input-tokens':
          {
            const text = `In: ${normalizedNumber(data.tokenMetrics.inputTokens || 0)}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'output-tokens':
          {
            const text = `Out: ${normalizedNumber(data.tokenMetrics.outputTokens || 0)}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'cached-tokens':
          {
            const text = `Cached: ${normalizedNumber(data.tokenMetrics.cachedTokens || 0)}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;
        case 'context-length':
          {
            const text = `Ctx: ${normalizedNumber(data.tokenMetrics.contextLength || 0)}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;

        case 'duration':
          {
            const text = `⌛${data.duration || 0}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;

        case 'cost':
          {
            let text = '';
            if ((data.cost ?? 0) == 0) {
              text = `💵 0`;
            } else {
              text = `💵 ${data.cost?.toPrecision(6)}`;
            }
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;

        case 'output-style':
          {
            const text = `📜 ${data.output_style || 0}`;
            const coloredText = colorText(text, eleClr);
            statusline.push(coloredText);
          }
          break;

        default:
          break;
      }

    }

    return statusline.join(separator);
  } catch (error) {
    return '';
  }
}

// ========== private functions ========== //

const hexToAnsi = (hex: string): string => {
  if (!hex || !hex.startsWith('#') || hex.length !== 7) {
    return '\x1b[37m';
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `\x1b[38;2;${r};${g};${b}m`;
}

const resetAnsi = (): string => {
  return '\x1b[0m';
}

const colorText = (text: string, color: string): string => {
  return `${hexToAnsi(color)}${text}${resetAnsi()}`;
}

const normalizedNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(2).replace(/\.?0+$/, '') + 'k';
  }

  return num.toString();
}