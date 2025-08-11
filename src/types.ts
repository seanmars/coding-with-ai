export interface ClaudeCodeStatus {
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

export interface RenderData {
  elements: Array<StatusElementData>;
  workspace: {
    currentDir: string;
    projectDir: string;
  };
  workingDir: string;
  modelName: string;
  tokenMetrics: TokenMetrics;
  gitBranch: string;
  version?: string;
}

export interface StatusElementData {
  type: ClaudeCodeStatuslineElementType;
  color?: string;
}

export interface StatuslineConfig {
  elements: Array<StatusElementData>;
}

export type ClaudeCodeStatuslineElementType =
  'time' |
  'cwd' |
  'model' |
  'version' |
  'git-branch' |
  'total-tokens' |
  'input-tokens' |
  'output-tokens' |
  'cached-tokens' |
  'context-length'
  ;