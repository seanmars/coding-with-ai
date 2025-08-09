import {
  getGitBranch,
  getTokenMetrics,
  renderStatusline
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

      const path = data.transcript_path;
      const metrics = await getTokenMetrics(path);

      const statusline = await renderStatusline({
        elements: [
          'cwd',
          'model',
          'git-branch',
          'total-tokens',
          'input-tokens',
          'output-tokens',
          'cached-tokens',
          'context-length',
          'version'
        ],
        workspace: {
          currentDir: data.workspace.current_dir,
          projectDir: data.workspace.project_dir
        },
        workingDir: data.cwd,
        modelName: data.model.display_name,
        tokenMetrics: metrics,
        gitBranch
      });

      console.log(statusline);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      process.exit(1);
    }
  } else {
    // Not in a TTY environment
    console.log('This script is intended to be run in a TTY environment with input from stdin.');
  }
}

main();
