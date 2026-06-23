import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateCsrf, csrfError } from "@/lib/csrf";

export async function POST(req: Request) {
  try {
    if (!validateCsrf(req as any)) return csrfError();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brandId } = await req.json();

    if (!brandId) {
      return NextResponse.json({ error: "brandId is required" }, { status: 400 });
    }

    // Verify the brand belongs to the user
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Update lastActiveAt so server-side sorting reflects the active brand
    await prisma.brand.update({
      where: { id: brandId },
      data: { lastActiveAt: new Date() },
    });

    // Set the active brand cookie (non-httpOnly so JS can read it for initialisation)
    const cookieStore = await cookies();
    cookieStore.set("active_brand_id", brandId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true, brandId });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to switch brand" },
      { status: 500 }
    );
  }
}