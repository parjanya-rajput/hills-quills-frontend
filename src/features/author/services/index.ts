import { apiClient } from "@/lib/api";
import { Author, AuthorSchema, AuthorSignUpResponseSchema } from "@/features/author/types";

// Create new author for admin
export async function createAuthor(name: string, email: string, profession: string, about: string, password: string, profile_photo_url: string): Promise<Author> {
    const result = await apiClient.post<Author>('/author/signup', {
        name,
        email,
        profession,
        about,
        password,
        profile_photo_url
    });
    const parsedAuthor = AuthorSignUpResponseSchema.parse(result.data);
    // Return only the author data (without tokens)
    const { token, refresh_token, ...authorData } = parsedAuthor;
    return authorData as Author;
}

// Fetch author by id
export async function fetchAuthorByIdForView(id: number): Promise<Author> {
    const result = await apiClient.get<Author>(`/author/${id}`);
    return AuthorSchema.parse(result.data);
}

// Update author details
export async function updateAuthor(
    id: number,
    name?: string,
    email?: string,
    profession?: string,
    about?: string,
    password?: string,
    profile_photo_url?: string
): Promise<Author> {
    const result = await apiClient.put<Author>(`/author/${id}`, {
        name,
        email,
        profession,
        about,
        password,
        profile_photo_url
    });
    return AuthorSchema.parse(result.data);
}

// Delete author (admin only)
export async function deleteAuthor(id: number): Promise<Author> {
    const result = await apiClient.delete<Author>(`/author/${id}`);
    return AuthorSchema.parse(result.data);
}

// Soft delete author by setting is_active to false
export async function setDeleteStatusAuthor(id: number): Promise<Author> {
    const result = await apiClient.put<Author>('/author/authors/status', {
        authorID: id,
        is_active: false
    });
    return AuthorSchema.parse(result.data);
}

// This will fetch all authors regardless of their status
export async function fetchAllAuthors(cursor: number, limit: number): Promise<Author[]> {
    const result = await apiClient.get<Author[]>(`/author/all?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => AuthorSchema.parse(item));
}