import { execSync } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';

import {
  ClaudeCodeStatuslineElementType,
  StatusJSON,
  TokenUsage,
  TokenMetrics,
  TranscriptLine,
} from './types.js'

const readFile = fs.promises?.readFile || promisify(fs.readFile);

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

    const content = await readFile(transcriptPath, 'utf-8');
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

export const renderStatusline = async (elements: Array<ClaudeCodeStatuslineElementType>,
  tokenMetrics: TokenMetrics,
  gitBranch: string
): Promise<string> => {
  try {
    const separator = ' | ';
    const statusline: string[] = [];

    elements.forEach(element => {
      switch (element) {
        case 'cwd':
          statusline.push(process.cwd());
          break;
        case 'model':
          statusline.push('Claude');
          break;
        case 'workspace-current-dir':
          statusline.push(process.cwd());
          break;
        case 'workspace-project-dir':
          statusline.push(process.cwd());
          break;
        case 'version':
          statusline.push('1.0.0');
          break;
        case 'git-branch':
          statusline.push(gitBranch);
          break;
        case 'total-tokens':
          statusline.push(tokenMetrics.totalTokens.toString());
          break;
        case 'input-tokens':
          statusline.push(tokenMetrics.inputTokens.toString());
          break;
        case 'output-tokens':
          statusline.push(tokenMetrics.outputTokens.toString());
          break;
        case 'cached-tokens':
          statusline.push(tokenMetrics.cachedTokens.toString());
          break;
        case 'context-length':
          statusline.push(tokenMetrics.contextLength.toString());
          break;

        default:
          break;
      }
    });

    return statusline.join(separator);
  } catch (error) {
    return '';
  }
}