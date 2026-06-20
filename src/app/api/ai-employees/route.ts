import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { aiEmployeeSchema } from "@/lib/validations";
import { EmployeeService } from "@/lib/ai-employees/employee-service";
import { validateCsrf, csrfError } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await prisma.aIEmployee.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { organizationId: session.user.id },
          { isSystem: true },
        ],
      },
      orderBy: [
        { isSystem: "desc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ employees });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch AI employees" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!validateCsrf(req as any)) return csrfError();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const employeeData = aiEmployeeSchema.parse(body);

    const employee = await prisma.aIEmployee.create({
      data: {
        ...employeeData,
        userId: session.user.id,
        isCustom: true,
        isSystem: false,
      },
    });

    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create AI employee" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    if (!validateCsrf(req as any)) return csrfError();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...employeeData } = aiEmployeeSchema.parse(body);

    const employee = await prisma.aIEmployee.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: employeeData,
    });

    return NextResponse.json({ employee });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update AI employee" },
      { status: 500 }
    );
  }
}
