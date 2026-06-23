import {
  AIProvider,
  AIProviderInterface,
  AIProviderConfig,
} from "./types";
import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { GeminiProvider } from "./providers/gemini";
import { OpenRouterProvider } from "./providers/openrouter";
import { GroqProvider } from "./providers/groq";

export class AIProviderFactory {
  private static defaultProvider: AIProvider = "openai";

  static setDefaultProvider(provider: AIProvider): void {
    this.defaultProvider = provider;
  }

  static getDefaultProvider(): AIProvider {
    return this.defaultProvider;
  }

  static getProvider(provider?: AIProvider): AIProviderInterface {
    const providerType = provider || this.defaultProvider;
    const config = this.getProviderConfig(providerType);
    return this.createProvider(providerType, config);
  }

  private static createProvider(
    provider: AIProvider,
    config: AIProviderConfig
  ): AIProviderInterface {
    switch (provider) {
      case "openai":
        return new OpenAIProvider(config);
      case "anthropic":
        return new AnthropicProvider(config);
      case "gemini":
        return new GeminiProvider(config);
      case "openrouter":
        return new OpenRouterProvider(config);
      case "groq":
        return new GroqProvider(config);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private static getProviderConfig(provider: AIProvider): AIProviderConfig {
    switch (provider) {
      case "openai":
        return {
          apiKey: process.env.OPENAI_API_KEY || "",
          model: process.env.OPENAI_MODEL || "gpt-4o",
        };
      case "anthropic":
        return {
          apiKey: process.env.ANTHROPIC_API_KEY || "",
          model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
        };
      case "gemini":
        return {
          apiKey: process.env.GOOGLE_AI_API_KEY || "",
          model: process.env.GEMINI_MODEL || "gemini-1.5-pro",
        };
      case "openrouter":
        return {
          apiKey: process.env.OPENROUTER_API_KEY || "",
          baseURL: "https://openrouter.ai/api/v1",
          model: process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
        };
      case "groq":
        return {
          apiKey: process.env.GROQ_API_KEY || "",
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        };
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  static validateProvider(provider: AIProvider): boolean {
    try {
      const instance = this.getProvider(provider);
      return instance.validateConfig();
    } catch {
      return false;
    }
  }

  static getAvailableProviders(): AIProvider[] {
    const providers: AIProvider[] = ["openai", "anthropic", "gemini", "openrouter", "groq"];
    return providers.filter((p) => this.validateProvider(p));
  }
}