import {
  fetchLatestArticles,
  fetchRegionArticles,
  fetchRegionArticleSet,
  fetchTopArticles,
  fetchTrendingTags,
  fetchArticlesByCategory,
  fetchArticlesByTag,
  fetchArticlesByAuthor,
  updateArticleStatusAuthor,
} from '@/features/article/services';
import { apiClient } from '@/lib/api';
import {
  createArticle,
  updateArticle,
  fetchArticleById,
  fetchAllArticles,
  updateArticleStatus,
  deleteArticle,
  fetchTagsForArticle,
  fetchArticleByIdForView,
  fetchGarhwalArticles,
  fetchKumaonArticles
} from '@/features/article/services';
import { Article } from '@/features/article/types';
import { Status, Category, Region, ImageFile } from '@/types/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { ArticleUpdates } from '@/features/article/types';

export const useApprovedArticleById = (id: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['articleById', id],
    queryFn: () => fetchArticleById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading, error };
};

export const useLatestNews = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['latestNews'],
    queryFn: () => fetchLatestArticles(Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};

export const useTopNews = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['topNews'],
    queryFn: () => fetchTopArticles(Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};

export const useRegionArticles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['regionArticles'],
    queryFn: () => fetchRegionArticleSet(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};

export const useArticlesByRegion = (region: Region) => {
  const { data, isLoading } = useQuery({
    queryKey: ['articlesByRegion', region],
    queryFn: () => fetchRegionArticles(region, Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};

export const useTrendingTags = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trendingTags'],
    queryFn: () => fetchTrendingTags(),
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });
  return { data, isLoading };
};

export const useArticlesByCategory = (category: Category) => {
  const { data, isLoading } = useQuery({
    queryKey: ['articlesByCategory', category],
    queryFn: () => fetchArticlesByCategory(category, Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};

export const useArticlesByTag = (tag: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['articlesByTag', tag],
    queryFn: () => fetchArticlesByTag(tag, Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};

export function useCreateArticle() {
  const [isCreating, setIsCreating] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: ({
      title,
      content,
      authorId,
      tags,
      status,
      category,
      region,
      imageUrl,
    }: {
      title: string;
      content: string;
      authorId: number;
      tags: string[];
      status: string;
      category: string;
      region: string;
      imageUrl: string;
    }) => createArticle(title, content, authorId, tags, status, category, region, imageUrl),
    onSuccess: (data) => {
      queryClient.setQueryData(['allArticle'], (oldData: Article[]) => {
        if (!oldData) {
          return [data];
        }
        return [data, ...oldData];
      });
    },
  });

  const articleCreate = useCallback(
    async (
      title: string,
      content: string,
      authorId: number,
      tags: string[],
      status: Status,
      category: Category,
      region: Region,
      image: ImageFile
    ) => {
      setIsCreating(true);

      try {
        // Upload the image first
        const uploadResponse = await apiClient.uploadImage(image.file!);
        const imageUrl = uploadResponse.data.url;
        await mutateAsync({ title, content, authorId, tags, status, category, region, imageUrl });
      } catch (err: any) {
        setIsCreating(false);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [mutateAsync]
  );
  return [articleCreate, isCreating] as const;
}

// admin side hook to fetch all articles
export function useArticles() {
  const {
    data: articles,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['allArticle'],
    queryFn: () => fetchAllArticles(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
  });
  return { articles, error, isLoading };
}

// Hook to fetch articles by author ID
export function useArticlesByAuthor(authorId: number) {
  const {
    data: articles,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['allArticle'],
    queryFn: () => fetchArticlesByAuthor(authorId, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
  });
  return { articles, error, isLoading };
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      title,
      content,
      tags,
      category,
      region,
      imageUrl,
    }: {
      id: number;
      title?: string;
      content?: string;
      tags?: string[];
      category?: string;
      region?: string;
      imageUrl?: string;
    }) => updateArticle(id, title, content, tags, category, region, imageUrl),
    onSuccess: (data) => {
      queryClient.setQueryData(['allArticle'], (oldData: Article[]) => {
        return oldData.map((article) => {
          if (article.id === data.id) {
            return data;
          }
          return article;
        });
      });
    },
  });

  const articleUpdate = useCallback(
    async (id: number, updates: ArticleUpdates) => {
      if (updates.imageFile) {
        const uploadResponse = await apiClient.uploadImage(updates.imageFile.file!);
        const imageUrl = uploadResponse.data.url;
        await mutateAsync({
          id,
          title: updates.title,
          content: updates.content,
          tags: updates.tags,
          category: updates.category,
          region: updates.region,
          imageUrl,
        });
      } else {
        await mutateAsync({
          id,
          title: updates.title,
          content: updates.content,
          tags: updates.tags,
          category: updates.category,
          region: updates.region,
        });
      }
    },
    [mutateAsync]
  );

  return { updateArticle: articleUpdate, isLoading: isPending };
}

export function useUpdateArticleStatus() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: number;
      status: Status;
      rejectionReason?: string;
    }) => updateArticleStatus(id, status, rejectionReason),
    onSuccess: (newArticle: Article) => {
      queryClient.setQueryData(['allArticle'], (oldData: Article[]) => {
        if (!oldData) return [];
        return oldData.map((article) => {
          if (article.id === newArticle.id) {
            return newArticle;
          }
          return article;
        });
      });
    },
  });

  return { updateArticleStatus: mutateAsync, isLoading: isPending };
}

export function useUpdateArticleStatusAuthor() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: Status;
    }) => updateArticleStatusAuthor(id, status),
    onSuccess: (newArticle: Article) => {
      queryClient.setQueryData(['allArticle'], (oldData: Article[]) => {
        if (!oldData) return [];
        return oldData.map((article) => {
          if (article.id === newArticle.id) {
            return newArticle;
          }
          return article;
        });
      });
    },
  });

  return { updateArticleStatus: mutateAsync, isLoading: isPending };
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: (deleteArticle: Article) => {
      queryClient.setQueryData(['allArticle'], (oldData: Article[]) => {
        return oldData.filter((article) => article.id !== deleteArticle.id);
      });
    },
  });

  return { deleteArticle: mutateAsync, isLoading: isPending, error };
}

export function useArticleById(id: number) {
  const {
    data: article,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleByIdForView(id),
    enabled: !!id,
  });
  return { article, error, isLoading };
}

export function useTagsForArticle(id?: number) {
  const {
    data: tags,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['tags', id],
    queryFn: () => fetchTagsForArticle(id as number),
    enabled: !!id,
    staleTime: 5 * 1000, // 5 seconds
  });

  return { tags: tags ?? [], error, isLoading };
}

export function useGarhwalArticles() {
  const { data, isLoading } = useQuery({
    queryKey: ['garhwalArticles'],
    queryFn: () => fetchGarhwalArticles(Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
}

export function useKumaonArticles() {
  const { data, isLoading } = useQuery({
    queryKey: ['kumaonArticles'],
    queryFn: () => fetchKumaonArticles(Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
}
