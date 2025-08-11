import * as path from 'path';
import {
  getGitBranch,
  getClaudeVersion,
  getTokenMetrics,
  renderStatusline,
  loadStatuslineConfig,
  getConstAppValues
} from './common.js';
import { ClaudeCodeStatus, RenderData } from './types.js';

async function waitingStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    return '';
  }

  const chunks: string[] = [];
  try {
    process.stdin.setEncoding('utf8');
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    return chunks.join('');
  } catch {
    return '';
  }
}

const main = async (): Promise<void> => {
  const { configPath } = getConstAppValues();

  if (!process.stdin.isTTY) {
    const input = await waitingStdin();
    const hasInput = input.trim() !== '';
    if (!hasInput) {
      console.error('No input received');
      process.exit(1);
    }

    try {

      const data: ClaudeCodeStatus = JSON.parse(input) as ClaudeCodeStatus;
      const gitBranch = await getGitBranch() ?? '';
      const claudeVersion = await getClaudeVersion() ?? '';
      const path = data.transcript_path;
      const metrics = await getTokenMetrics(path);
      const config = await loadStatuslineConfig(configPath);

      const statusline = await renderStatusline({
        elements: config.elements,
        workspace: {
          currentDir: data.workspace.current_dir,
          projectDir: data.workspace.project_dir
        },
        workingDir: data.cwd,
        modelName: data.model.display_name,
        tokenMetrics: metrics,
        gitBranch: gitBranch,
        version: claudeVersion
      });

      console.log(statusline);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      process.exit(1);
    }
  } else {
    console.error('This script requires input from stdin. Please pipe JSON data to it.');
    process.exit(0);
  }
}

main();
