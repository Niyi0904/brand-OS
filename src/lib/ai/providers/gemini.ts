import { VertexAI } from "@google-cloud/vertexai";
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

export class GeminiProvider implements AIProviderInterface {
  provider: AIProvider = "gemini";
  private client: VertexAI;
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.client = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT || "",
      location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
      googleAuthOptions: {
        credentials: config.apiKey ? JSON.parse(config.apiKey) : undefined,
      },
    });
  }

  validateConfig(): boolean {
    return !!this.config.apiKey || !!process.env.GOOGLE_CLOUD_PROJECT;
  }

  async complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    try {
      const model = this.client.getGenerativeModel({
        model: options?.model || this.config.model || "gemini-1.5-pro",
      });

      const systemInstruction = messages.find((m) => m.role === "system")?.content;
      const chatMessages = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const result = await model.generateContent({
        contents: chatMessages,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 2048,
          topP: options?.topP,
        },
      });

      const content = result.response.text();

      return {
        content,
        usage: {
          promptTokens: result.response.usageMetadata?.promptTokenCount || 0,
          completionTokens: result.response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: result.response.usageMetadata?.totalTokenCount || 0,
        },
        model: options?.model || this.config.model || "gemini-1.5-pro",
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
      const model = this.client.getGenerativeModel({
        model: options?.model || this.config.model || "gemini-1.5-pro",
      });

      const systemInstruction = messages.find((m) => m.role === "system")?.content;
      const chatMessages = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const result = await model.generateContentStream({
        contents: chatMessages,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 2048,
          topP: options?.topP,
        },
      });

      for await (const chunk of result.stream) {
        const content = chunk.text();
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
    return aiError;
  }
}
