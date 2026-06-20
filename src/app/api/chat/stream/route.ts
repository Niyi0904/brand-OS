import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeBrandForPrompt } from "@/lib/brand-context-serializer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, conversationId, employeeId, brandId } = body;

    if (!message || !employeeId || !brandId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get employee
    const employee = await prisma.aIEmployee.findUnique({
      where: { id: employeeId },
      select: { id: true, name: true, title: true, prompt: true, accentColor: true },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Get brand for context
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { id: true, name: true },
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
          employeeId,
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

    // Serialize Brand Brain context
    const brandContext = await serializeBrandForPrompt(brandId);

    // Build system prompt with Brand Brain context
    const systemPrompt = `${employee.prompt}

${brandContext ? `\n\nBrand Context:\n${brandContext}` : ""}`;

    // For M3, return a mock streaming response
    // In production, this would call the AI provider
    const mockResponse = `I'm ${employee.name}, your ${employee.title || "AI assistant"}. I've received your message about "${message.slice(0, 30)}..." and I'm ready to help you with ${brand.name}.\n\nThis is a placeholder response. In production, I would:\n1. Analyze your Brand Brain context\n2. Provide tailored recommendations\n3. Stream the response token-by-token`;

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: activeConversationId,
        role: "ASSISTANT",
        content: mockResponse,
      },
    });

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send conversation ID first
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ conversationId: activeConversationId, messageId: assistantMessage.id })}\n\n`)
        );

        // Stream the response word by word
        const words = mockResponse.split(" ");
        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
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