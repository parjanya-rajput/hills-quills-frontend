import { apiClient } from "@/lib/api";
import { Article, ArticleSchema, ArticleViewWithAuthorSchema, ArticleViewWithAuthor } from "@/features/article/types";
import { Status, Paginated, withPagination } from "@/types/common";


// This will fetch all the articles which are also not approved
export async function fetchAllArticles(cursor: number, limit: number): Promise<Article[]> {
    const result = await apiClient.get<Article[]>(`/articles/all?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}

export async function createArticle(title: string, content: string, authorId: number, tags: string[], status: string,  category: string, region: string, image: string): Promise<Article> {
    const result = await apiClient.post<Article>('/articles', {
        title,
        content,
        authorId,
        status,
        category,
        tags,
        region,
        image
    });
    return ArticleSchema.parse(result.data);
}

// Update article status (admin only)
export async function updateArticleStatus(
    articleId: number, 
    status: Status, 
    rejectionReason?: string | null
): Promise<Article> {
    const payload: any = { status };
    if (status === Status.Rejected ) {
        if (rejectionReason) {
            payload.rejection_reason = rejectionReason;
        } else {
            throw new Error("Rejection reason is required");
        }
    }
    
    const result = await apiClient.patch<Article>(`/articles/${articleId}/status`, payload);
    return ArticleSchema.parse(result.data);
}

// Convert draft to pending (author only)
export async function updateArticleStatusAuthor(
    articleId: number, 
    status: Status, 
): Promise<Article> {
    const payload: any = { status };
    const result = await apiClient.patch<Article>(`/articles/${articleId}/author/publish`, payload);
    return ArticleSchema.parse(result.data);
}

// This will fetch even the articles which are not approved
export async function fetchArticleByIdForView(id: number): Promise<ArticleViewWithAuthor> {
    const result = await apiClient.get<ArticleViewWithAuthor>(`/articles/view/${id}`);
    return ArticleViewWithAuthorSchema.parse(result.data);
}

export async function updateArticle(
    id: number,
    title?: string,
    content?: string,
    tags?: string[],
    category?: string,   
    region?: string,
    image?: string
): Promise<Article> {
    const result = await apiClient.put<Article>(`/articles/${id}`, {
        title,
        content,
        tags,
        category,
        region,
        image
    });
    return ArticleSchema.parse(result.data);
}

// Delete article (admin only)
export async function deleteArticle(id: number): Promise<Article> {
    const result = await apiClient.delete<Article>(`/articles/${id}`);
    return ArticleSchema.parse(result.data);
}

export async function fetchTagsForArticle(id: number): Promise<string[]> {
    const result = await apiClient.get<string[]>(`/articles/tags/${id}`);
    return result.data;
}

// ***********************************
// ************Author Services********
// ***********************************

export async function fetchArticlesByAuthor(authorId: number, cursor: number, limit: number): Promise<Article[]> {
    const result = await apiClient.get<Article[]>(`/articles/author/${authorId}?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}


// ***********************************
// ************Public Services********
// ***********************************

export async function fetchArticleById(id: number): Promise<ArticleViewWithAuthor> {
    const result = await apiClient.get<ArticleViewWithAuthor>(`/articles/approved/${id}`);
    return ArticleViewWithAuthorSchema.parse(result.data);
}

export async function fetchLatestArticles(cursor: number, limit: number): Promise<Paginated<Article>> {
    const result = await apiClient.get<Article[]>(`/articles/approved/latest?cursor=${cursor}&limit=${limit}`);
    return withPagination(ArticleSchema).parse(result);
}

export async function fetchTopArticles(cursor: number, limit: number): Promise<Article[]> {
    console.log('fetching top articles');
    const result = await apiClient.get<Article[]>(`/articles/approved/top?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}

export async function fetchRegionArticles(region: string, cursor: number, limit: number): Promise<Article[]> {
    const result = await apiClient.get<Article[]>(`/articles/approved/region/${region}?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}

export async function fetchArticlesByCategory(category: string, cursor: number, limit: number): Promise<Article[]> {
    const result = await apiClient.get<Article[]>(`/articles/approved/category/${category}?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}

export async function fetchRegionArticleSet(): Promise<Article[]> {
    const result = await apiClient.get<Article[]>(`/articles/approved/region-set`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}

export async function fetchTrendingTags(): Promise<string[]> {
    const result = await apiClient.get<string[]>(`/tags/trending`);
    return result.data;
}

export async function fetchGarhwalArticles(cursor: number, limit: number): Promise<Article[]> {
    const result = await apiClient.get<Article[]>(`/articles/approved/garhwal?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}

export async function fetchArticlesByTag(tag: string, cursor: number, limit: number): Promise<Article[]> {
    const result = await apiClient.get<Article[]>(`/articles/approved/tag/${tag}?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}

export async function fetchKumaonArticles(cursor: number, limit: number): Promise<Article[]> {
    const result = await apiClient.get<Article[]>(`/articles/approved/kumaon?cursor=${cursor}&limit=${limit}`);
    return result.data.map((item: any) => ArticleSchema.parse(item));
}
