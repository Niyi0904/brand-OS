import { VertexAI } from "@google-cloud/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
  private config: AIProviderConfig;
  private vertexClient: VertexAI | null = null;
  private genAIClient: GoogleGenerativeAI | null = null;

  constructor(config: AIProviderConfig) {
    this.config = config;

    // Use VertexAI only if GOOGLE_CLOUD_PROJECT is set (service account / ADC auth)
    if (process.env.GOOGLE_CLOUD_PROJECT) {
      this.vertexClient = new VertexAI({
        project: process.env.GOOGLE_CLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
        googleAuthOptions: config.apiKey
          ? { credentials: JSON.parse(config.apiKey) }
          : undefined,
      });
    }

    // Use GoogleGenerativeAI for API key auth (standard case)
    if (config.apiKey && !process.env.GOOGLE_CLOUD_PROJECT) {
      this.genAIClient = new GoogleGenerativeAI(config.apiKey);
    }
  }

  validateConfig(): boolean {
    return !!this.config.apiKey || !!process.env.GOOGLE_CLOUD_PROJECT;
  }

  async complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    try {
      const modelName = options?.model || this.config.model || "gemini-1.5-pro";
      const systemInstruction = messages.find((m) => m.role === "system")?.content;

      if (this.genAIClient) {
        return await this.completeWithGenAI(modelName, systemInstruction, messages, options);
      }

      if (this.vertexClient) {
        return await this.completeWithVertex(modelName, systemInstruction, messages, options);
      }

      throw new Error("Gemini provider not configured: no API key or project set");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async *stream(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk> {
    try {
      const modelName = options?.model || this.config.model || "gemini-1.5-pro";
      const systemInstruction = messages.find((m) => m.role === "system")?.content;

      if (this.genAIClient) {
        yield* this.streamWithGenAI(modelName, systemInstruction, messages, options);
        return;
      }

      if (this.vertexClient) {
        yield* this.streamWithVertex(modelName, systemInstruction, messages, options);
        return;
      }

      throw new Error("Gemini provider not configured: no API key or project set");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async completeWithGenAI(
    modelName: string,
    systemInstruction: string | undefined,
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    const model = this.genAIClient!.getGenerativeModel({
      model: modelName,
      systemInstruction,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
        topP: options?.topP,
      },
    });

    const chatMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const result = await model.generateContent({
      contents: chatMessages,
      systemInstruction: systemInstruction ? { role: "user", parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
        topP: options?.topP,
      },
    });
    const response = result.response;
    const text = (result.response as { text: () => string }).text();

    return {
      content: text,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0,
      },
      model: modelName,
      provider: this.provider,
    };
  }

  private async completeWithVertex(
    modelName: string,
    systemInstruction: string | undefined,
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    const model = this.vertexClient!.getGenerativeModel({ model: modelName });
    const chatMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const result = await model.generateContent({
      contents: chatMessages,
      systemInstruction: systemInstruction ? { role: "user", parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
        topP: options?.topP,
      },
    });

    const content = (result.response as { text: () => string } | undefined)?.text() || "";
    return {
      content,
      usage: {
        promptTokens: result.response.usageMetadata?.promptTokenCount || 0,
        completionTokens: result.response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: result.response.usageMetadata?.totalTokenCount || 0,
      },
      model: modelName,
      provider: this.provider,
    };
  }

  private async *streamWithGenAI(
    modelName: string,
    systemInstruction: string | undefined,
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk> {
    const model = this.genAIClient!.getGenerativeModel({
      model: modelName,
      systemInstruction,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
        topP: options?.topP,
      },
    });

    const chatMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const result = await model.generateContentStream({
      contents: chatMessages,
      systemInstruction: systemInstruction ? { role: "user", parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
        topP: options?.topP,
      },
    });

    for await (const chunk of result.stream) {
      const content = (chunk as { text: () => string }).text();
      if (content) {
        yield { content, done: false };
      }
    }

    yield { content: "", done: true };
  }

  private async *streamWithVertex(
    modelName: string,
    systemInstruction: string | undefined,
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk> {
    const model = this.vertexClient!.getGenerativeModel({ model: modelName });
    const chatMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const result = await model.generateContentStream({
      contents: chatMessages,
      systemInstruction: systemInstruction ? { role: "user", parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
        topP: options?.topP,
      },
    });

    for await (const chunk of result.stream) {
      const content = (chunk as { text: () => string }).text();
      if (content) {
        yield { content, done: false };
      }
    }

    yield { content: "", done: true };
  }

  private handleError(error: unknown): AIError {
    const aiError: AIError = new Error(
      error instanceof Error ? error.message : "Unknown error"
    ) as AIError;
    aiError.provider = this.provider;
    return aiError;
  }
}