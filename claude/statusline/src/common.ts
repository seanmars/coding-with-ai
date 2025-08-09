import { execSync } from 'child_process';
import * as fs from 'fs';

import {
  ClaudeCodeStatuslineElementType,
  ClaudeCodeStatus,
  TokenUsage,
  TokenMetrics,
  TranscriptLine,
  RenderData,
} from './types.js'

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

      switch (element) {
        case 'cwd':
          {
            const text = `📂 ${data.workspace.currentDir}`;
            statusline.push(text);
          }
          break;
        case 'model':
          {
            const text = `[${data.modelName}]`;
            statusline.push(text);
          }
          break;
        case 'version':
          {
            const text = `Ver: ${data.version || '-'}`;
            statusline.push(text);
          }
          break;
        case 'git-branch':
          {
            const text = `🌿 ${data.gitBranch || '?'}`;
            statusline.push(text);
          }
          break;
        case 'total-tokens':
          {
            const text = `Total: ${data.tokenMetrics.totalTokens || 0}`;
            statusline.push(text);
          }
          break;
        case 'input-tokens':
          {
            const text = `In: ${data.tokenMetrics.inputTokens || 0}`;
            statusline.push(text);
          }
          break;
        case 'output-tokens':
          {
            const text = `Out: ${data.tokenMetrics.outputTokens || 0}`;
            statusline.push(text);
          }
          break;
        case 'cached-tokens':
          {
            const text = `Cached: ${data.tokenMetrics.cachedTokens || 0}`;
            statusline.push(text);
          }
          break;
        case 'context-length':
          {
            const text = `Ctx: ${data.tokenMetrics.contextLength || 0}`;
            statusline.push(text);
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