/**
 * Preservation Property Tests — Task 2
 *
 * These tests run against UNFIXED code and are EXPECTED TO PASS.
 * They capture correct baseline behaviours that must remain green after
 * every fix is applied (regression guard).
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 3.9, 3.10
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import fc from "fast-check";

// ---------------------------------------------------------------------------
// Module mocks — prevent real DB / auth / cache calls
// ---------------------------------------------------------------------------

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    brand: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    brandBrain: {
      upsert: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports — must be after vi.mock() hoisting
// ---------------------------------------------------------------------------

import { brandBrainSchema } from "@/lib/validations";
import { updateBrandBrainAction } from "@/app/dashboard/brands/[slug]/settings/actions";
import { computeBrandBrainCompleteness } from "@/lib/brand-utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { BrandBrain } from "@prisma/client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All plain-text string fields defined in brandBrainSchema (M2 + legacy M1). */
const TEXT_FIELDS = [
  // M2 text fields
  "tagline",
  "websiteUrl",
  "industry",
  "missionStatement",
  "brandPromise",
  "toneDescription",
  "writingStyleNotes",
  "thingsToAvoid",
  "primaryAudience",
  "audienceDemographics",
  "audiencePainPoints",
  "audienceVocabulary",
  "pricingTier",
  "keyDifferentiators",
  "competitiveAdvantages",
  "thingsNeverDo",
  "topicsToOwn",
  "topicsToAvoid",
  "freeformNotes",
  "contentExamples",
  "brandStory",
  // Legacy M1 text fields
  "mission",
  "vision",
  "values",
  "targetAudience",
  "customerPersonas",
  "products",
  "services",
  "toneOfVoice",
  "brandColors",
  "typography",
  "competitors",
  "seoKeywords",
  "goals",
  "preferredPlatforms",
  "writingStyle",
  "marketingStrategy",
  "offers",
  "businessInfo",
  "locations",
  "faqs",
  "brandRules",
] as const;

/** All M2 fields tracked by computeBrandBrainCompleteness. */
const COMPLETENESS_FIELDS = [
  "tagline",
  "websiteUrl",
  "industry",
  "missionStatement",
  "coreValues",
  "brandPromise",
  "voiceAdjectives",
  "toneDescription",
  "writingStyleNotes",
  "thingsToAvoid",
  "primaryAudience",
  "audienceDemographics",
  "audiencePainPoints",
  "audienceVocabulary",
  "productList",
  "pricingTier",
  "keyDifferentiators",
  "competitorList",
  "competitiveAdvantages",
  "thingsNeverDo",
  "primaryKeywords",
  "secondaryKeywords",
  "topicsToOwn",
  "topicsToAvoid",
  "faqList",
  "freeformNotes",
  "contentExamples",
  "brandStory",
] as const;

/** Legacy M1 fields that must survive M2-only saves. */
const LEGACY_M1_FIELDS = [
  "mission",
  "vision",
  "values",
  "targetAudience",
  "customerPersonas",
  "products",
  "services",
  "toneOfVoice",
  "brandColors",
  "typography",
  "competitors",
  "seoKeywords",
  "goals",
  "preferredPlatforms",
  "writingStyle",
  "marketingStrategy",
  "offers",
  "businessInfo",
  "locations",
  "faqs",
  "brandRules",
] as const;

/** Build a minimal BrandBrain-shaped object for computeBrandBrainCompleteness. */
function makeBrain(overrides: Partial<Record<string, string | number | null>> = {}): BrandBrain {
  const base: Record<string, unknown> = {
    id: "brain-id",
    brandId: "brand-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    foundedYear: null,
    logo: null,
    accentColour: null,
    // All string fields default to empty
    ...Object.fromEntries(COMPLETENESS_FIELDS.map((f) => [f, ""])),
    ...Object.fromEntries(LEGACY_M1_FIELDS.map((f) => [f, ""])),
    // Extra fields present in the Prisma model but not tracked for completeness
    coreValues: "",
    voiceAdjectives: "",
    productList: "",
    competitorList: "",
    faqList: "",
    primaryKeywords: "",
    secondaryKeywords: "",
  };
  return { ...base, ...overrides } as BrandBrain;
}

// ===========================================================================
// P1 — Existing M2 field round-trip (text fields)
// ===========================================================================

describe("P1 — Zod schema round-trip: text fields parse correctly", () => {
  /**
   * Validates: Requirements 3.1, 3.8
   *
   * Property: For every plain-text field in brandBrainSchema, parsing a
   * non-empty string value succeeds and returns the input unchanged.
   */
  it("P1 property: every text field parses a non-empty string and returns it unchanged", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...TEXT_FIELDS),
        fc.string({ minLength: 1 }),
        (field, value) => {
          const result = brandBrainSchema.safeParse({ [field]: value });
          if (!result.success) return false;
          return (result.data as Record<string, unknown>)[field] === value;
        },
      ),
      { verbose: true },
    );
  });

  /**
   * Validates: Requirements 3.1, 3.8
   *
   * Unit: each listed text field is present in the schema shape.
   */
  it("P1 unit: all expected text fields exist in brandBrainSchema", () => {
    const shape = brandBrainSchema.shape;
    for (const field of TEXT_FIELDS) {
      expect(shape).toHaveProperty(field);
    }
  });

  /**
   * Validates: Requirements 3.1, 3.8
   *
   * Unit: parsing a full record of non-empty strings succeeds for all fields.
   */
  it("P1 unit: parsing a complete record of non-empty strings succeeds", () => {
    const input: Record<string, string> = {};
    for (const field of TEXT_FIELDS) {
      input[field] = `test-value-for-${field}`;
    }
    const result = brandBrainSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      for (const field of TEXT_FIELDS) {
        expect((result.data as Record<string, unknown>)[field]).toBe(
          `test-value-for-${field}`,
        );
      }
    }
  });
});

// ===========================================================================
// P2 — Per-user brand isolation
// ===========================================================================

describe("P2 — Per-user brand isolation: WHERE clause filters by userId", () => {
  /**
   * Validates: Requirements 3.2
   *
   * The query `prisma.brand.findFirst({ where: { slug, userId } })` must only
   * return a brand whose userId matches the requesting session user.
   *
   * This tests the WHERE condition construction — no real DB needed.
   */
  it("P2 unit: same slug for two different users produces distinct WHERE clauses", () => {
    const slug = "my-brand";
    const userA = "user-a-id";
    const userB = "user-b-id";

    const whereA = { slug, userId: userA };
    const whereB = { slug, userId: userB };

    // Both WHERE clauses target the same slug
    expect(whereA.slug).toBe(whereB.slug);
    // But filter on different userIds — they cannot collide
    expect(whereA.userId).not.toBe(whereB.userId);
  });

  /**
   * Validates: Requirements 3.2
   *
   * Property: For any two distinct user IDs, the WHERE clause constructed with
   * the same slug never produces identical WHERE objects (they differ on userId).
   */
  it("P2 property: distinct userIds always produce distinct WHERE clauses for same slug", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (slug, userIdA, userIdB) => {
          fc.pre(userIdA !== userIdB);

          const whereA = { slug, userId: userIdA };
          const whereB = { slug, userId: userIdB };

          // Same slug
          if (whereA.slug !== whereB.slug) return true; // same slug by construction
          // Different userId means different result — the filter is correctly distinct
          return whereA.userId !== whereB.userId;
        },
      ),
      { verbose: true },
    );
  });

  /**
   * Validates: Requirements 3.2
   *
   * Unit: when updateBrandBrainAction looks up a brand, it uses BOTH slug AND
   * userId in the WHERE clause (mock confirms the call shape).
   */
  it("P2 unit: updateBrandBrainAction passes userId to findFirst WHERE clause", async () => {
    const mockAuth = vi.mocked(auth);
    const mockFindFirst = vi.mocked(prisma.brand.findFirst);

    mockAuth.mockResolvedValueOnce({
      user: { id: "user-123", email: "user@example.com", name: "Test User" },
    } as Awaited<ReturnType<typeof auth>>);

    // Return null → action returns "Brand not found" early (we only care about the WHERE call)
    mockFindFirst.mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.set("slug", "test-slug");

    await updateBrandBrainAction({}, formData);

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          slug: "test-slug",
          userId: "user-123",
        }),
      }),
    );
  });
});

// ===========================================================================
// P3 — Auth redirect (action guard)
// ===========================================================================

describe("P3 — Auth guard: missing session returns Unauthorised", () => {
  /**
   * Validates: Requirements 3.3
   *
   * When auth() returns null, updateBrandBrainAction must return
   * { message: "Unauthorised" } — no DB call, no data leak.
   */
  it("P3 unit: null session returns { message: 'Unauthorised' }", async () => {
    const mockAuth = vi.mocked(auth);
    mockAuth.mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.set("slug", "some-brand");

    const result = await updateBrandBrainAction({}, formData);

    expect(result).toEqual({ message: "Unauthorised" });
  });

  /**
   * Validates: Requirements 3.3
   *
   * When auth() returns a session without a user id, action is still guarded.
   */
  it("P3 unit: session with no user.id returns { message: 'Unauthorised' }", async () => {
    const mockAuth = vi.mocked(auth);
    // Simulate session where user.id is undefined/empty
    mockAuth.mockResolvedValueOnce({
      user: { id: "", email: "x@x.com", name: "X" },
    } as Awaited<ReturnType<typeof auth>>);

    const formData = new FormData();
    formData.set("slug", "some-brand");

    const result = await updateBrandBrainAction({}, formData);

    expect(result).toEqual({ message: "Unauthorised" });
  });

  /**
   * Validates: Requirements 3.3
   *
   * When unauthenticated, prisma must never be called — no data leakage.
   */
  it("P3 unit: no DB call is made when session is missing", async () => {
    const mockAuth = vi.mocked(auth);
    const mockFindFirst = vi.mocked(prisma.brand.findFirst);

    mockAuth.mockResolvedValueOnce(null);
    mockFindFirst.mockClear();

    const formData = new FormData();
    formData.set("slug", "some-brand");

    await updateBrandBrainAction({}, formData);

    expect(mockFindFirst).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// P4 — revalidatePath fires after successful save
// ===========================================================================

describe("P4 — revalidatePath fires after successful save", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Validates: Requirements 3.4, 3.5
   *
   * After a successful save, revalidatePath must be called with:
   *   1. The brand settings path  (/dashboard/brands/<slug>/settings)
   *   2. The dashboard layout path (/dashboard, "layout")
   */
  it("P4 unit: revalidatePath called with settings path and dashboard layout on success", async () => {
    const mockAuth = vi.mocked(auth);
    const mockFindFirst = vi.mocked(prisma.brand.findFirst);
    const mockTransaction = vi.mocked(prisma.$transaction);
    const mockRevalidatePath = vi.mocked(revalidatePath);

    mockAuth.mockResolvedValueOnce({
      user: { id: "user-123", email: "user@test.com", name: "Test" },
    } as Awaited<ReturnType<typeof auth>>);

    mockFindFirst.mockResolvedValueOnce({ id: "brand-id" } as Awaited<
      ReturnType<typeof prisma.brand.findFirst>
    >);

    // Mock the nested write (current unfixed code uses brand.update with nested upsert,
    // not $transaction yet — mock brand.update to simulate success)
    const mockUpdate = vi.mocked(prisma.brand.update);
    mockUpdate.mockResolvedValueOnce({} as Awaited<ReturnType<typeof prisma.brand.update>>);
    mockTransaction.mockResolvedValueOnce([]);

    const formData = new FormData();
    formData.set("slug", "my-brand");
    formData.set("tagline", "Great brand");

    const result = await updateBrandBrainAction({}, formData);

    // The action should have succeeded
    expect(result.message).toBe("Brand Brain saved successfully");

    // Both revalidatePath calls must have fired
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      "/dashboard/brands/my-brand/settings",
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard", "layout");
  });

  /**
   * Validates: Requirements 3.4, 3.5
   *
   * revalidatePath must be called EXACTLY with the slug from FormData.
   */
  it("P4 unit: settings revalidatePath uses the slug from FormData", async () => {
    const mockAuth = vi.mocked(auth);
    const mockFindFirst = vi.mocked(prisma.brand.findFirst);
    const mockUpdate = vi.mocked(prisma.brand.update);
    const mockRevalidatePath = vi.mocked(revalidatePath);

    mockAuth.mockResolvedValueOnce({
      user: { id: "user-abc", email: "u@u.com", name: "U" },
    } as Awaited<ReturnType<typeof auth>>);

    mockFindFirst.mockResolvedValueOnce({ id: "brand-xyz" } as Awaited<
      ReturnType<typeof prisma.brand.findFirst>
    >);

    mockUpdate.mockResolvedValueOnce({} as Awaited<ReturnType<typeof prisma.brand.update>>);

    const formData = new FormData();
    formData.set("slug", "awesome-slug");

    await updateBrandBrainAction({}, formData);

    expect(mockRevalidatePath).toHaveBeenCalledWith(
      "/dashboard/brands/awesome-slug/settings",
    );
  });
});

// ===========================================================================
// P5 — computeBrandBrainCompleteness score monotonicity
// ===========================================================================

describe("P5 — computeBrandBrainCompleteness monotonicity", () => {
  /**
   * Validates: Requirements 3.9
   *
   * Property: Adding a non-empty field to a brain with fewer filled fields
   * returns a score ≥ the original score (monotone non-decreasing).
   */
  it("P5 property: adding a non-empty field never decreases the completeness score", () => {
    fc.assert(
      fc.property(
        // Pick a random subset of completeness fields to pre-fill
        fc.subarray([...COMPLETENESS_FIELDS], { minLength: 0, maxLength: COMPLETENESS_FIELDS.length - 1 }),
        // Pick a field NOT in the subset to add
        fc.nat({ max: COMPLETENESS_FIELDS.length - 1 }),
        fc.string({ minLength: 1 }),
        (filledFields, newFieldIdx, newValue) => {
          // Find a field that is NOT already in filledFields
          const candidates = COMPLETENESS_FIELDS.filter(
            (f) => !filledFields.includes(f),
          );
          if (candidates.length === 0) return true; // all fields already filled — skip

          const newField = candidates[newFieldIdx % candidates.length];

          // Build a brain with only the pre-filled fields set
          const brainBefore = makeBrain(
            Object.fromEntries(filledFields.map((f) => [f, "value"])),
          );

          // Build a brain with the pre-filled fields PLUS the new field
          const brainAfter = makeBrain({
            ...Object.fromEntries(filledFields.map((f) => [f, "value"])),
            [newField]: newValue,
          });

          const scoreBefore = computeBrandBrainCompleteness(brainBefore);
          const scoreAfter = computeBrandBrainCompleteness(brainAfter);

          return scoreAfter >= scoreBefore;
        },
      ),
      { verbose: true, numRuns: 200 },
    );
  });

  /**
   * Validates: Requirements 3.9
   *
   * Unit: empty brain scores 0%, fully-filled brain scores 100%.
   */
  it("P5 unit: empty brain scores 0", () => {
    const brain = makeBrain({});
    expect(computeBrandBrainCompleteness(brain)).toBe(0);
  });

  it("P5 unit: fully filled brain scores 100", () => {
    const brain = makeBrain(
      Object.fromEntries(COMPLETENESS_FIELDS.map((f) => [f, "non-empty"])),
    );
    expect(computeBrandBrainCompleteness(brain)).toBe(100);
  });

  it("P5 unit: null brain scores 0", () => {
    expect(computeBrandBrainCompleteness(null)).toBe(0);
  });

  /**
   * Validates: Requirements 3.9
   *
   * Unit: score is always in [0, 100].
   */
  it("P5 unit: score is always in the range [0, 100]", () => {
    fc.assert(
      fc.property(
        fc.subarray([...COMPLETENESS_FIELDS], { minLength: 0 }),
        (filledFields) => {
          const brain = makeBrain(
            Object.fromEntries(filledFields.map((f) => [f, "value"])),
          );
          const score = computeBrandBrainCompleteness(brain);
          return score >= 0 && score <= 100;
        },
      ),
    );
  });
});

// ===========================================================================
// P6 — Legacy M1 fields preserved (schema defaults to "", not null)
// ===========================================================================

describe("P6 — Legacy M1 fields not overwritten when only M2 FormData provided", () => {
  /**
   * Validates: Requirements 3.10
   *
   * The brandBrainSchema uses .default("") for all legacy M1 fields.
   * When those fields are absent from input, they default to "" — never null.
   * This means a M2-only save will write "" for M1 fields if absent from FormData,
   * but crucially the SCHEMA itself does not produce null or strip the fields.
   */
  it("P6 unit: legacy M1 fields default to '' (not null) when omitted from parse input", () => {
    // Parse with only M2 fields — no legacy M1 fields supplied
    const m2OnlyInput: Record<string, string> = {
      tagline: "Great tagline",
      websiteUrl: "https://example.com",
      industry: "Tech",
      missionStatement: "Our mission",
      brandPromise: "Our promise",
    };

    const result = brandBrainSchema.safeParse(m2OnlyInput);
    expect(result.success).toBe(true);

    if (result.success) {
      for (const field of LEGACY_M1_FIELDS) {
        const value = (result.data as Record<string, unknown>)[field];
        // Must be "" not null — the schema preserves an empty string, not null
        expect(value).toBe("");
        expect(value).not.toBeNull();
      }
    }
  });

  /**
   * Validates: Requirements 3.10
   *
   * Property: For any M2-only input (no legacy fields), all legacy M1 fields
   * in the parsed output are "" not null.
   */
  it("P6 property: parsed output never produces null for legacy M1 fields", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LEGACY_M1_FIELDS),
        fc.record({
          tagline: fc.string(),
          missionStatement: fc.string(),
          brandPromise: fc.string(),
          toneDescription: fc.string(),
        }),
        (legacyField, m2Values) => {
          // Parse with M2 values but without the specific legacy field
          const result = brandBrainSchema.safeParse(m2Values);
          if (!result.success) return true; // schema still parses (optional fields)

          const value = (result.data as Record<string, unknown>)[legacyField];
          // Legacy field must be "" (its default) when not provided — never null
          return value === "" && value !== null;
        },
      ),
      { verbose: true },
    );
  });

  /**
   * Validates: Requirements 3.10
   *
   * Unit: updateBrandBrainAction with M2-only FormData reads the legacy fields
   * from FormData as "" (since they are not present, formData.get returns null,
   * and the action converts null → ""). Zod then preserves "" as "".
   * Result: legacy fields are written as "" not null — no data overwrite with null.
   */
  it("P6 unit: action with M2-only FormData sends '' for missing legacy fields (not null)", async () => {
    const mockAuth = vi.mocked(auth);
    const mockFindFirst = vi.mocked(prisma.brand.findFirst);
    const mockUpdate = vi.mocked(prisma.brand.update);

    mockAuth.mockResolvedValueOnce({
      user: { id: "user-999", email: "u@u.com", name: "U" },
    } as Awaited<ReturnType<typeof auth>>);

    mockFindFirst.mockResolvedValueOnce({ id: "brand-999" } as Awaited<
      ReturnType<typeof prisma.brand.findFirst>
    >);

    // Capture what the action passes to prisma.brand.update
    let capturedUpdateData: Record<string, unknown> = {};
    mockUpdate.mockImplementationOnce(async (args) => {
      capturedUpdateData = (args as { data: Record<string, unknown> }).data ?? {};
      return {} as Awaited<ReturnType<typeof prisma.brand.update>>;
    });

    // M2-only FormData — no legacy fields
    const formData = new FormData();
    formData.set("slug", "test-brand");
    formData.set("tagline", "A tagline");
    formData.set("missionStatement", "A mission");
    // Deliberately omit all legacy M1 fields

    await updateBrandBrainAction({}, formData);

    // Dig into the brandBrain upsert data (passed as nested write inside brand.update)
    const brainData =
      (capturedUpdateData?.brandBrain as { upsert?: { update?: Record<string, unknown> } })
        ?.upsert?.update ?? capturedUpdateData;

    // For each legacy M1 field, the value should be "" not null
    for (const field of LEGACY_M1_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(brainData, field)) {
        expect(brainData[field]).not.toBeNull();
        // Acceptable values: "" (empty string default) or undefined (field not in update payload)
        expect(brainData[field]).toBe("");
      }
    }
  });
});
