export interface StatusJSON {
  session_id: string;
  transcript_path: string;
  cwd: string;
  model: {
    id: string;
    display_name: string;
  };
  workspace: {
    current_dir: string;
    project_dir: string;
  };
  version?: string;
}

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

export interface TranscriptLine {
  message?: {
    usage?: TokenUsage;
  };
  isSidechain?: boolean;
  timestamp?: string;
}

export interface TokenMetrics {
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  totalTokens: number;
  contextLength: number;
}

export type ClaudeCodeStatuslineElementType =
  'cwd' |
  'model' |
  'workspace-current-dir' |
  'workspace-project-dir' |
  'version' |
  'git-branch' |
  'total-tokens' |
  'input-tokens' |
  'output-tokens' |
  'cached-tokens' |
  'context-length'
  ;