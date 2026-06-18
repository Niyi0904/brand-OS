import { prisma } from "@/lib/db";
import { BrandBrain } from "@prisma/client";
import { AIProviderFactory, AIMessage, AICompletionOptions } from "@/lib/ai";

export class EmployeeService {
  static async initializeDefaultEmployees(userId: string, organizationId?: string) {
    const { DEFAULT_AI_EMPLOYEES } = await import("./default-employees");

    for (const employeeData of DEFAULT_AI_EMPLOYEES) {
      await prisma.aIEmployee.upsert({
        where: {
          id: `${employeeData.name?.toLowerCase().replace(/\s+/g, "-")}-${userId}`,
        },
        update: {},
        create: {
          ...employeeData,
          id: `${employeeData.name?.toLowerCase().replace(/\s+/g, "-")}-${userId}`,
          userId,
          organizationId,
        },
      });
    }
  }

  static async getEmployeePrompt(
    employeeId: string,
    brandBrain?: BrandBrain | null
  ): Promise<string> {
    const employee = await prisma.aIEmployee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    let prompt = employee.prompt;

    if (brandBrain) {
      prompt = this.injectBrandBrain(prompt, brandBrain);
    }

    return prompt;
  }

  private static injectBrandBrain(prompt: string, brandBrain: BrandBrain): string {
    const brandContext = this.formatBrandBrain(brandBrain);
    return prompt.replace("{{BRAND_BRAIN}}", brandContext);
  }

  private static formatBrandBrain(brandBrain: BrandBrain): string {
    const sections = [];

    if (brandBrain.mission) sections.push(`## Mission\n${brandBrain.mission}`);
    if (brandBrain.vision) sections.push(`## Vision\n${brandBrain.vision}`);
    if (brandBrain.values) sections.push(`## Values\n${brandBrain.values}`);
    if (brandBrain.targetAudience) sections.push(`## Target Audience\n${brandBrain.targetAudience}`);
    if (brandBrain.customerPersonas) sections.push(`## Customer Personas\n${brandBrain.customerPersonas}`);
    if (brandBrain.products) sections.push(`## Products\n${brandBrain.products}`);
    if (brandBrain.services) sections.push(`## Services\n${brandBrain.services}`);
    if (brandBrain.toneOfVoice) sections.push(`## Tone of Voice\n${brandBrain.toneOfVoice}`);
    if (brandBrain.brandColors) sections.push(`## Brand Colors\n${brandBrain.brandColors}`);
    if (brandBrain.typography) sections.push(`## Typography\n${brandBrain.typography}`);
    if (brandBrain.competitors) sections.push(`## Competitors\n${brandBrain.competitors}`);
    if (brandBrain.seoKeywords) sections.push(`## SEO Keywords\n${brandBrain.seoKeywords}`);
    if (brandBrain.goals) sections.push(`## Goals\n${brandBrain.goals}`);
    if (brandBrain.preferredPlatforms) sections.push(`## Preferred Platforms\n${brandBrain.preferredPlatforms}`);
    if (brandBrain.writingStyle) sections.push(`## Writing Style\n${brandBrain.writingStyle}`);
    if (brandBrain.marketingStrategy) sections.push(`## Marketing Strategy\n${brandBrain.marketingStrategy}`);
    if (brandBrain.offers) sections.push(`## Offers\n${brandBrain.offers}`);
    if (brandBrain.businessInfo) sections.push(`## Business Information\n${brandBrain.businessInfo}`);
    if (brandBrain.locations) sections.push(`## Locations\n${brandBrain.locations}`);
    if (brandBrain.faqs) sections.push(`## FAQs\n${brandBrain.faqs}`);
    if (brandBrain.brandRules) sections.push(`## Brand Rules\n${brandBrain.brandRules}`);

    return sections.join("\n\n");
  }

  static async executeEmployeeTask(
    employeeId: string,
    userMessage: string,
    brandBrain?: BrandBrain | null,
    options?: AICompletionOptions
  ): Promise<string> {
    const systemPrompt = await this.getEmployeePrompt(employeeId, brandBrain);
    const provider = AIProviderFactory.getProvider();

    const messages: AIMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    const response = await provider.complete(messages, options);
    return response.content;
  }

  static async executeEmployeeTaskStream(
    employeeId: string,
    userMessage: string,
    brandBrain?: BrandBrain | null,
    options?: AICompletionOptions
  ): AsyncGenerator<string> {
    const systemPrompt = await this.getEmployeePrompt(employeeId, brandBrain);
    const provider = AIProviderFactory.getProvider();

    const messages: AIMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    const stream = provider.stream(messages, options);

    for await (const chunk of stream) {
      if (!chunk.done) {
        yield chunk.content;
      }
    }
  }
}
