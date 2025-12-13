import { z, ZodTypeAny } from "zod";

export const LoginResponseSchema = z.object({
    token: z.string(),
    refresh_token: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const UploadImageResponseSchema = z.object({
    url: z.url(),
});

export type UploadImageResponse = z.infer<typeof UploadImageResponseSchema>;

export type ImageFile = {
  previewUrl: string;
  file?: File;
}

export const PREVIEW_ARTICLE_IMAGE: ImageFile = {
  previewUrl: '/images/placeholder.png',
}

export const PREVIEW_STORY_IMAGE: ImageFile = {
  previewUrl: '/images/story_placeholder.png',
}

export enum Status {
    Pending  = "pending",
    Approved = "approved",
    Rejected = "rejected",
    Draft    = "draft",
  }
  
export enum Category {
  Politics = "politics",
  Defence = "defence",
  Economy = "economy",
  Environment = "environment",
  Education = "education",
  Health = "health",
  Tourism = "tourism",
  Culture = "culture",
}

export enum Region {
  Almora = "Almora",
  Bageshwar = "Bageshwar",
  Chamoli = "Chamoli",
  Champawat = "Champawat",
  Dehradun = "Dehradun",
  Haridwar = "Haridwar",
  Nainital = "Nainital",
  PauriGarhwal = "Pauri Garhwal",
  Pithoragarh = "Pithoragarh",
  Rudraprayag = "Rudraprayag",
  TehriGarhwal = "Tehri Garhwal",
  UdhamSinghNagar = "Udham Singh Nagar",
  Uttarkashi = "Uttarkashi",
}

export type Paginated<T> = {
  data: T[];
  pagination: {
    hasNext: boolean;
    nextCursor: number;
  }
}

export function withPagination<T extends ZodTypeAny>(schema: T) {
  return z.object({
    data: z.array(schema), // or z.array(schema) if you want a list
    pagination: z.object({
      hasNext: z.boolean(),
      nextCursor: z.number(),
    }),
  });
}