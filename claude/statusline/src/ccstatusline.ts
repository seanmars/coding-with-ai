
import {
  getGitBranch,
  getTokenMetrics,
  renderStatusline
} from './common.js';

const gitBranch = await getGitBranch() ?? '';
console.log(gitBranch);

const path = 'C:\\Users\\mars\\.claude\\projects\\F--workspace-ssg-article-bot\\a5a60da3-6880-4878-8bf4-ef61c3c37372.jsonl';
const metrics = await getTokenMetrics(path);

const statusline = await renderStatusline(
  ['cwd', 'model', 'git-branch', 'total-tokens', 'input-tokens', 'output-tokens', 'cached-tokens', 'context-length'],
  metrics,
  gitBranch);
console.log(statusline);
