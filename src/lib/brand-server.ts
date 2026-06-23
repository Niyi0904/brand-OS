import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const ACTIVE_BRAND_COOKIE = "active_brand_id";

/**
 * Read the active brand ID from the cookie set by the brand-switch API.
 * Safe to call in any server component or API route.
 */
export async function getServerActiveBrandId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(ACTIVE_BRAND_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch the full active Brand (including brandBrain) from the server.
 * Returns null when no cookie is set or the brand no longer exists.
 */
export async function getServerActiveBrand(userId: string, includeBrain = false) {
  const brandId = await getServerActiveBrandId();
  if (!brandId) return null;

  return prisma.brand.findFirst({
    where: { id: brandId, userId },
    include: includeBrain ? { brandBrain: true } : undefined,
  });
}

/**
 * Helper: given a Prisma `where` clause object, optionally adds a
 * `brandId` constraint when an active brand cookie is present.
 *
 * Usage:
 *   const conversations = await prisma.conversation.findMany({
 *     where: withBrandScope({ userId }, brandId),
 *   });
 */
export function withBrandScope<T extends Record<string, unknown>>(
  where: T,
  brandId: string | null | undefined,
): T {
  if (brandId) {
    return { ...where, brandId } as T;
  }
  return where;
}
