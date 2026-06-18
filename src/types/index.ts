import { User, Brand, BrandBrain, AIEmployee, Campaign, ContentItem, MediaAsset, Organization } from "@prisma/client";

export type UserWithRelations = User & {
  accounts?: any[];
  sessions?: any[];
  organizations?: any[];
  brands?: Brand[];
};

export type BrandWithBrain = Brand & {
  brandBrain?: BrandBrain | null;
};

export type BrandWithRelations = Brand & {
  brandBrain?: BrandBrain | null;
  campaigns?: Campaign[];
  contentItems?: ContentItem[];
  mediaAssets?: MediaAsset[];
};

export type AIEmployeeWithRelations = AIEmployee & {
  conversations?: any[];
};

export type CampaignWithRelations = Campaign & {
  brand?: Brand;
  contentItems?: ContentItem[];
};

export type ContentItemWithRelations = ContentItem & {
  brand?: Brand;
  campaign?: Campaign | null;
};

export type OrganizationWithRelations = Organization & {
  members?: any[];
  brands?: Brand[];
  subscriptions?: any[];
};

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: any;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  brandId: string;
  userId: string;
  employeeId?: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

export interface AIProvider {
  name: string;
  apiKey: string;
  model?: string;
}

export interface BrandBrainData {
  mission?: string;
  vision?: string;
  values?: string;
  targetAudience?: string;
  customerPersonas?: string;
  products?: string;
  services?: string;
  toneOfVoice?: string;
  brandColors?: string;
  typography?: string;
  competitors?: string;
  seoKeywords?: string;
  goals?: string;
  preferredPlatforms?: string;
  writingStyle?: string;
  marketingStrategy?: string;
  offers?: string;
  businessInfo?: string;
  locations?: string;
  faqs?: string;
  brandRules?: string;
}
