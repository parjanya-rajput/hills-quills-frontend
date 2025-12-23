import { apiClient } from "@/lib/api";
import { Author, AuthorSchema } from "@/features/auth/author";
import { LoginResponse, LoginResponseSchema } from "@/types/common";

export async function fetchAuthor(): Promise<Author> {
    const result = await apiClient.get('/author');
    return AuthorSchema.parse(result.data); 
}

export async function fetchAllAuthors(cursor: number, limit: number): Promise<Author[]> {
    const result = await apiClient.get<Author[]>('/author/all?cursor=' + cursor + '&limit=' + limit);
    return result.data;
}

export async function loginAuthor(email: string, password: string): Promise<LoginResponse & Author> {
    const result = await apiClient.post<Author>('/author/login', { email, password });
    return LoginResponseSchema.and(AuthorSchema).parse(result.data);
}

export async function refreshAuthorToken(refreshToken: string): Promise<LoginResponse & Author> {
    const result = await apiClient.post<Author>('/author/refresh-token', { refresh_token: refreshToken });
    return LoginResponseSchema.and(AuthorSchema).parse(result.data);
}