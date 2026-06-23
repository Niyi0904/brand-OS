import { PrismaClient } from "@prisma/client";
import type { AIEmployeeCreateInput } from "../src/lib/ai-employees/default-employees";
import { DEFAULT_AI_EMPLOYEES } from "../src/lib/ai-employees/default-employees";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding default AI employees...");

  for (const employeeData of DEFAULT_AI_EMPLOYEES) {
    const name = employeeData.name;
    if (!name) continue;

    // Check if already exists
    const existing = await prisma.aIEmployee.findFirst({
      where: {
        slug: employeeData.slug,
        isSystem: true,
      },
    });

    if (existing) {
      console.log(`  ✓ ${name} already exists (skipping)`);
      continue;
    }

    // Create employee
    const data: AIEmployeeCreateInput = {
      ...employeeData,
      name: employeeData.name ?? "",
      slug: employeeData.slug,
      icon: employeeData.icon,
      isSystem: true,
      isCustom: false,
    };
    await prisma.aIEmployee.create({ data });

    console.log(`  ✓ Created ${name}`);
  }

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });