import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import {
  brandIdentitySchema,
  missionValuesSchema,
  voiceToneSchema,
  targetAudienceSchema,
  productsServicesSchema,
  competitorsSchema,
  seoKeywordsSchema,
  faqsSchema,
  additionalContextSchema,
} from "@/lib/validations";

const sectionSchemas: Record<string, z.ZodSchema> = {
  "brand-identity": brandIdentitySchema,
  "mission-values": missionValuesSchema,
  "voice-tone": voiceToneSchema,
  "target-audience": targetAudienceSchema,
  "products-services": productsServicesSchema,
  competitors: competitorsSchema,
  "seo-keywords": seoKeywordsSchema,
  faqs: faqsSchema,
  "additional-context": additionalContextSchema,
};

const sectionFieldMap: Record<string, Record<string, string>> = {
  "brand-identity": {
    brandName: "name",
    tagline: "tagline",
    websiteUrl: "websiteUrl",
    industry: "industry",
    foundedYear: "foundedYear",
    logo: "logo",
  },
  "mission-values": {
    missionStatement: "missionStatement",
    coreValues: "coreValues",
    brandPromise: "brandPromise",
  },
  "voice-tone": {
    voiceAdjectives: "voiceAdjectives",
    toneDescription: "toneDescription",
    writingStyleNotes: "writingStyleNotes",
    thingsToAvoid: "thingsToAvoid",
  },
  "target-audience": {
    primaryAudience: "primaryAudience",
    audienceDemographics: "audienceDemographics",
    audiencePainPoints: "audiencePainPoints",
    audienceVocabulary: "audienceVocabulary",
  },
  "products-services": {
    productList: "productList",
    pricingTier: "pricingTier",
    keyDifferentiators: "keyDifferentiators",
  },
  competitors: {
    competitorList: "competitorList",
    competitiveAdvantages: "competitiveAdvantages",
    thingsNeverDo: "thingsNeverDo",
  },
  "seo-keywords": {
    primaryKeywords: "primaryKeywords",
    secondaryKeywords: "secondaryKeywords",
    topicsToOwn: "topicsToOwn",
    topicsToAvoid: "topicsToAvoid",
  },
  faqs: {
    faqList: "faqList",
  },
  "additional-context": {
    freeformNotes: "freeformNotes",
    contentExamples: "contentExamples",
    brandStory: "brandStory",
  },
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId } = await params;
    const schema = sectionSchemas[sectionId];
    if (!schema) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const raw: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        raw[key] = value;
      }
    }

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.findFirst({
      where: { slug, userId: session.user.id },
      select: { id: true },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const fieldMap = sectionFieldMap[sectionId];
    const updateData: Record<string, unknown> = {};

    if (parsed.success) {
      const data = parsed.data as Record<string, unknown>;
      for (const [formField, dbField] of Object.entries(fieldMap)) {
        if (formField === "brandName") {
          updateData.name = data[formField];
        } else if (formField === "foundedYear") {
          const val = data[formField];
          updateData[dbField] = val ? parseInt(val as string) : null;
        } else {
          updateData[dbField] = data[formField] || null;
        }
      }

      await prisma.brandBrain.upsert({
        where: { brandId: brand.id },
        create: {
          brandId: brand.id,
          ...updateData,
        },
        update: updateData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save section" },
      { status: 500 }
    );
  }
}