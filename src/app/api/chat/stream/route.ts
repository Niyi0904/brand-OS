import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeBrandForPrompt } from "@/lib/brand-context-serializer";
import { AIProviderFactory } from "@/lib/ai/provider-factory";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, conversationId, employeeId, employeeSlug, brandId } = body;

    if (!message || !brandId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!employeeId && !employeeSlug) {
      return NextResponse.json(
        { error: "employeeId or employeeSlug required" },
        { status: 400 }
      );
    }

    // Get employee by slug or id
    const employee = employeeId
      ? await prisma.aIEmployee.findUnique({
          where: { id: employeeId },
          select: { id: true, name: true, title: true, prompt: true, accentColor: true, slug: true },
        })
      : await prisma.aIEmployee.findUnique({
          where: { slug: employeeSlug },
          select: { id: true, name: true, title: true, prompt: true, accentColor: true, slug: true },
        });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Get brand for context — verify ownership and include brand brain
    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
      select: { id: true, name: true, brandBrain: true },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Get or create conversation
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          employeeId: employee.id,
          brandId,
          title: message.slice(0, 50),
        },
      });
      activeConversationId = conversation.id;
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: activeConversationId,
        role: "USER",
        content: message,
      },
    });

    // Serialize Brand Brain context from the brand's brain object
    const brandContext = serializeBrandForPrompt(brand?.brandBrain ?? null);

    // Build system prompt — replace {{BRAND_BRAIN}} placeholder in the employee prompt
    const systemPrompt = employee.prompt.includes("{{BRAND_BRAIN}}")
      ? employee.prompt.replace("{{BRAND_BRAIN}}", brandContext)
      : `${employee.prompt}\n\n${brandContext ? `Brand Context:\n${brandContext}` : ""}`;

    // Try to use real AI provider (Groq, OpenAI, etc.)
    let useRealAI = false;
    let provider = null;
    try {
      provider = AIProviderFactory.getProvider();
      useRealAI = provider.validateConfig();
    } catch {
      useRealAI = false;
    }

    const encoder = new TextEncoder();
    let assistantContent = "";
    let assistantMessageId = "";

    if (useRealAI && provider) {
      // Real AI streaming
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const messages = [
              { role: "system" as const, content: systemPrompt },
              { role: "user" as const, content: message },
            ];

            // Save placeholder assistant message
            const assistantMessage = await prisma.message.create({
              data: {
                conversationId: activeConversationId,
                role: "ASSISTANT",
                content: "",
              },
            });
            assistantMessageId = assistantMessage.id;

            // Send conversation ID first
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ conversationId: activeConversationId, messageId: assistantMessageId })}\n\n`)
            );

            // Stream from provider
            for await (const chunk of provider.stream(messages)) {
              if (chunk.done) break;
              assistantContent += chunk.content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`)
              );
            }

            // Update message with full content
            await prisma.message.update({
              where: { id: assistantMessageId },
              data: { content: assistantContent },
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
            controller.close();
          } catch (error) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`)
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Fallback: mock streaming response
    const mockResponse = `I'm ${employee.name}, your ${employee.title || "AI assistant"}. I've received your message about "${message.slice(0, 30)}..." and I'm ready to help you with ${brand.name}.\n\nThis is a placeholder response. To enable real AI responses, add your Groq API key to the .env file:\n\n\`\`\`\nGROQ_API_KEY=your_key_here\n\`\`\`\n\nThen restart the dev server.`;

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: activeConversationId,
        role: "ASSISTANT",
        content: mockResponse,
      },
    });
    assistantMessageId = assistantMessage.id;

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        // Send conversation ID first
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ conversationId: activeConversationId, messageId: assistantMessageId })}\n\n`)
        );

        // Stream the response word by word
        const words = mockResponse.split(" ");
        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 30));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: words[i] + " " })}\n\n`)
          );
        }

        // Send done event
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat stream error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
