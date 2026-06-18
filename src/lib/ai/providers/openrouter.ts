import OpenAI from "openai";
import {
  AIProviderInterface,
  AIMessage,
  AICompletionOptions,
  AICompletionResponse,
  AIStreamChunk,
  AIProviderConfig,
  AIError,
  AIProvider,
} from "../types";

export class OpenRouterProvider implements AIProviderInterface {
  provider: AIProvider = "openrouter";
  private client: OpenAI;
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || "https://openrouter.ai/api/v1",
    });
  }

  validateConfig(): boolean {
    return !!this.config.apiKey;
  }

  async complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: options?.model || this.config.model || "anthropic/claude-3.5-sonnet",
        messages: messages.map((m) => ({
          role: m.role as "system" | "user" | "assistant",
          content: m.content,
        })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
      });

      const content = response.choices[0]?.message?.content || "";

      return {
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        model: response.model,
        provider: this.provider,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async *stream(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk> {
    try {
      const stream = await this.client.chat.completions.create({
        model: options?.model || this.config.model || "anthropic/claude-3.5-sonnet",
        messages: messages.map((m) => ({
          role: m.role as "system" | "user" | "assistant",
          content: m.content,
        })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          yield {
            content,
            done: false,
          };
        }
      }

      yield { content: "", done: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): AIError {
    const aiError: AIError = new Error(
      error instanceof Error ? error.message : "Unknown error"
    ) as AIError;
    aiError.provider = this.provider;

    if (error instanceof OpenAI.APIError) {
      aiError.code = error.code || undefined;
      aiError.statusCode = error.status || undefined;
    }

    return aiError;
  }
}
