import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { brandBrainSchema } from "@/lib/validations";
import { validateCsrf, csrfError } from "@/lib/csrf";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brand = await prisma.brand.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        brandBrain: true,
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ brandBrain: brand.brandBrain });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch brand brain" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateCsrf(req as any)) return csrfError();
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = brandBrainSchema.parse(body);

    // Convert foundedYear from string to number for Prisma Int field
    const { foundedYear, ...restData } = parsed;
    const updateData: Record<string, unknown> = { ...restData };
    if (foundedYear) {
      const year = parseInt(foundedYear, 10);
      updateData.foundedYear = isNaN(year) ? null : year;
    } else {
      updateData.foundedYear = null;
    }

    const brand = await prisma.brand.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandBrain = await prisma.brandBrain.upsert({
      where: {
        brandId: id,
      },
      update: updateData,
      create: {
        ...updateData,
        brandId: id,
      },
    });

    return NextResponse.json({ brandBrain });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update brand brain" },
      { status: 500 }
    );
  }
}