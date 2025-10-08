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

const msToTimeStr = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if(hours > 0) {
    return `${hours.toString()}h${minutes.toString()}m`;
  }

  return `${minutes.toString()}m${seconds.toString()}s`;
};

const main = async (): Promise<void> => {
  const { userStatuslineConfigPath } = getConstAppValues();

  if (!process.stdin.isTTY) {
    const input = await waitingStdin();
    const hasInput = input.trim() !== '';
    if (!hasInput) {
      console.error('No input received');
      process.exit(1);
    }

    try {

      const data: ClaudeCodeStatus = JSON.parse(input) as ClaudeCodeStatus;
      const claudeVersion = data.version;
      const path = data.transcript_path;
      const cost = Math.fround(data.cost.total_cost_usd);
      const duration = msToTimeStr(data.cost.total_duration_ms);
      const output_style = data.output_style.name;

      const gitBranch = await getGitBranch() ?? '';
      const metrics = await getTokenMetrics(path);
      const config = await loadStatuslineConfig(userStatuslineConfigPath);

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
        version: claudeVersion,
        cost: cost,
        duration: duration,
        output_style: output_style
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
