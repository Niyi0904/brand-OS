import { z } from "zod";

// Auth validations
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

// Brand validations
export const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  logo: z.string().optional(),
});

export const brandBrainSchema = z.object({
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.string().optional(),
  targetAudience: z.string().optional(),
  customerPersonas: z.string().optional(),
  products: z.string().optional(),
  services: z.string().optional(),
  toneOfVoice: z.string().optional(),
  brandColors: z.string().optional(),
  typography: z.string().optional(),
  competitors: z.string().optional(),
  seoKeywords: z.string().optional(),
  goals: z.string().optional(),
  preferredPlatforms: z.string().optional(),
  writingStyle: z.string().optional(),
  marketingStrategy: z.string().optional(),
  offers: z.string().optional(),
  businessInfo: z.string().optional(),
  locations: z.string().optional(),
  faqs: z.string().optional(),
  brandRules: z.string().optional(),
});

// Campaign validations
export const campaignSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  description: z.string().optional(),
  goal: z.string().optional(),
  audience: z.string().optional(),
  offer: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  kpis: z.record(z.any()).optional(),
});

// Content validations
export const contentItemSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  contentType: z.enum(["POST", "STORY", "REEL", "VIDEO", "BLOG", "EMAIL", "AD", "OTHER"]),
  platform: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  scheduledFor: z.date().optional(),
  campaignId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// AI Employee validations
export const aiEmployeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  purpose: z.string().optional(),
  responsibilities: z.string().optional(),
  knowledge: z.string().optional(),
  thinkingFramework: z.string().optional(),
  decisionTree: z.string().optional(),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  outputFormat: z.string().optional(),
  examples: z.string().optional(),
  qualityChecklist: z.string().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type BrandInput = z.infer<typeof brandSchema>;
export type BrandBrainInput = z.infer<typeof brandBrainSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
export type ContentItemInput = z.infer<typeof contentItemSchema>;
export type AIEmployeeInput = z.infer<typeof aiEmployeeSchema>;
