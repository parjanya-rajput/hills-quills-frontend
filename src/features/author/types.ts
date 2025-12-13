import z from "zod";

// import { Category, ImageFile, Region, Status } from "@/types/common";

// Zod schema for Author
export const AuthorViewSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    is_active: z.number(),
    about: z.string().nullable(),
    profession: z.string().nullable(),
    profile_photo_url: z.string().nullable(),
});

export type AuthorView = z.infer<typeof AuthorViewSchema>;

export const AuthorSchema = AuthorViewSchema.extend({
    created_at: z.string(),
    // backend has 'password_hash' field which we don't need here
});

export type Author = z.infer<typeof AuthorSchema>;

export const AuthorSignUpResponseSchema = AuthorViewSchema.extend({
    token: z.string(),
    refresh_token: z.string(),
});

export type AuthorSignUpResponse = z.infer<typeof AuthorSignUpResponseSchema>;

export type AuthorUpdates = {
    imageFile: any;
    name?: string;
    email?: string;
    profession?: string;
    about?: string;
    password?: string;
    profile_photo_url?: string;
};