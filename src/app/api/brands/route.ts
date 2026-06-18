import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { brandSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brands = await prisma.brand.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        brandBrain: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ brands });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, logo } = brandSchema.parse(body);

    const existingBrand = await prisma.brand.findFirst({
      where: {
        slug,
        userId: session.user.id,
      },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Brand with this slug already exists" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description,
        logo,
        userId: session.user.id,
        brandBrain: {
          create: {},
        },
      },
      include: {
        brandBrain: true,
      },
    });

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
