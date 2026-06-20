import { prisma } from "@/lib/db";
import { BrandBrain } from "@prisma/client";
import { AIProviderFactory, AIMessage, AICompletionOptions } from "@/lib/ai";
import { serializeBrandForPrompt } from "@/lib/brand-context-serializer";

export class EmployeeService {
  static async initializeDefaultEmployees(userId: string, organizationId?: string) {
    const { DEFAULT_AI_EMPLOYEES } = await import("./default-employees");

    for (const employeeData of DEFAULT_AI_EMPLOYEES) {
      const name = employeeData.name;
      if (!name) continue;

      // Look up by name + userId to avoid fragile composite IDs
      const existing = await prisma.aIEmployee.findFirst({
        where: {
          name,
          userId,
          isSystem: true,
        },
        select: { id: true },
      });

      if (!existing) {
        await prisma.aIEmployee.create({
          data: {
            ...employeeData,
            userId,
            organizationId,
            isSystem: true,
            isCustom: false,
            name: employeeData.name ?? "",
          } as any,
        });
      }
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
    const brandContext = serializeBrandForPrompt(brandBrain);
    return prompt.replace("{{BRAND_BRAIN}}", brandContext);
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
  ): Promise<AsyncGenerator<string>> {
    const systemPrompt = await this.getEmployeePrompt(employeeId, brandBrain);
    const provider = AIProviderFactory.getProvider();

    const messages: AIMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    const stream = provider.stream(messages, options);

    async function* generate() {
      for await (const chunk of stream) {
        if (!chunk.done) {
          yield chunk.content;
        }
      }
    }

    return generate();
  }
}