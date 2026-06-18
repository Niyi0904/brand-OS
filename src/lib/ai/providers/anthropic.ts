import Anthropic from "@anthropic-ai/sdk";
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

export class AnthropicProvider implements AIProviderInterface {
  provider: AIProvider = "anthropic";
  private client: Anthropic;
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
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
      const response = await this.client.messages.create({
        model: options?.model || this.config.model || "claude-3-5-sonnet-20241022",
        max_tokens: options?.maxTokens ?? 2048,
        temperature: options?.temperature ?? 0.7,
        top_p: options?.topP,
        messages: messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        system: messages.find((m) => m.role === "system")?.content,
      });

      const content = response.content[0]?.type === "text" ? response.content[0].text : "";

      return {
        content,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
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
      const stream = await this.client.messages.create({
        model: options?.model || this.config.model || "claude-3-5-sonnet-20241022",
        max_tokens: options?.maxTokens ?? 2048,
        temperature: options?.temperature ?? 0.7,
        top_p: options?.topP,
        messages: messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        system: messages.find((m) => m.role === "system")?.content,
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield {
            content: event.delta.text,
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

    if (error instanceof Anthropic.APIError) {
      aiError.code = error.error?.type;
      aiError.statusCode = error.status;
    }

    return aiError;
  }
}
