export type AIProvider = "openai" | "anthropic" | "gemini" | "openrouter" | "groq";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
}

export interface AICompletionResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: AIProvider;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
}

export interface AIProviderConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}

export interface AIProviderInterface {
  provider: AIProvider;
  complete(messages: AIMessage[], options?: AICompletionOptions): Promise<AICompletionResponse>;
  stream(messages: AIMessage[], options?: AICompletionOptions): AsyncGenerator<AIStreamChunk>;
  validateConfig(): boolean;
}

export interface AIError extends Error {
  provider: AIProvider;
  code?: string;
  statusCode?: number;
}
