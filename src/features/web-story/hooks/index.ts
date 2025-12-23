import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SlideUpdates, Story, StoryUpdates } from '@/features/web-story/types';
import {
  createStory,
  fetchAllStories,
  updateStoryStatus,
  deleteStory,
  fetchLatestWebStories,
  fetchGarhwalWebStories,
  fetchKumaonWebStories,
  updateStory,
  deleteSlidesForStory,
  createSlidesForStory,
  updateSlide,
  fetchWebStoriesByAuthor,
} from '@/features/web-story/services';
import React, { useCallback, useState } from 'react';
import { SlideForm, StoryFormState } from '@/features/web-story/component/story-form';
import { Category, Status } from '@/types/common';
import { apiClient } from '@/lib/api';
import { Region } from '@/types/common';
import { toast } from 'sonner';
import { fetchTagsForStory } from '@/features/web-story/services';
import { fetchSlidesForStory } from '@/features/web-story/services';
import { SlideRequest } from '@/features/web-story/services';
import { fetchStoryById } from '@/features/web-story/services';

export function useCreateStory() {
  const [isCreating, setIsCreating] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: ({
      authorId,
      title,
      region,
      category,
      tags,
      slides,
      cover_image_url,
      status,
    }: {
      authorId: number;
      title: string;
      region: Region;
      category: Category;
      tags: string[];
      slides: SlideRequest[];
      cover_image_url: string;
      status: Status;
    }) => createStory(authorId, title, region, category, tags, slides, cover_image_url, status),
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(['allStory'], (oldData: Story[]) => {
        if (!oldData) {
          return [data];
        }
        return [data, ...oldData];
      });
    },
  });

  const storyCreate = useCallback(
    async (
      authorId: number,
      title: string,
      region: Region,
      category: Category,
      tags: string[],
      slides: SlideForm[],
      cover_image: File,
      status: Status
    ) => {
      try {
        setIsCreating(true);

        const uploadResponse = await apiClient.uploadImage(cover_image);
        const cover_image_url = uploadResponse.data.url;
        const slides_data = await Promise.all(
          slides.map(async (slide, index) => {
            const uploadResponse = await apiClient.uploadImage(slide.image.file!);
            return {
              slide_order: index + 1,
              image_url: uploadResponse.data.url,
              caption: slide.caption,
              duration: slide.duration,
            };
          })
        );
        await mutateAsync({
          authorId,
          title,
          region,
          category,
          tags,
          slides: slides_data,
          cover_image_url,
          status,
        });
      } catch (error) {
        setIsCreating(false);
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [mutateAsync]
  );

  return { createStory: storyCreate, isCreating };
}

// admin access only
export function useStories() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['allStory'],
    queryFn: () => fetchAllStories(10000, 10000),
  });
  return { stories: data || [], error, isLoading };
}

// story by author for author dashboard
export function useStoriesByAuthor(authorId: number) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['allStory'],
    queryFn: () => fetchWebStoriesByAuthor(authorId, 10000, 10000),
  });
  return { stories: data || [], error, isLoading };
}

export function useUpdateStoryStatus() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: number;
      status: Status;
      rejectionReason?: string;
    }) => updateStoryStatus(id, status, rejectionReason),
    onSuccess: (data) => {
      // Update the stories cache
      queryClient.setQueryData(['allStory'], (oldData: Story[]) => {
        if (!oldData) return oldData;
        return oldData.map((story) => (story.id === data.id ? data : story));
      });
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Failed to update story status: ' + (error?.message || 'Unknown error'));
    },
  });

  return { updateStoryStatus: mutateAsync, isLoading: isPending };
}

export function useDeleteStory() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (storyId: number) => deleteStory(storyId),
    onSuccess: (data) => {
      // Remove the story from the cache
      queryClient.setQueryData(['allStory'], (oldData: Story[]) => {
        if (!oldData) return oldData;
        return oldData.filter((story) => story.id !== data.id);
      });
    },
  });

  return { deleteStory: mutateAsync, isLoading: isPending };
}

export function useUpdateStory() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      title,
      category,
      region,
      imageUrl,
      tags,
    }: {
      id: number;
      title?: string;
      category?: string;
      region?: string;
      imageUrl?: string;
      tags?: string[];
    }) => updateStory(id, title, category, region, imageUrl, tags),
    onSuccess: (data) => {
      toast.success('Story updated successfully');
      queryClient.setQueryData(['allStory'], (oldData: Story[]) => {
        return oldData.map((story) => {
          if (story.id === data.id) {
            return data;
          }
          return story;
        });
      });
    },
  });
  const storyUpdate = useCallback(
    async (id: number, updates: StoryUpdates) => {
      if (updates.imageFile) {
        const uploadResponse = await apiClient.uploadImage(updates.imageFile.file!);
        const imageUrl = uploadResponse.data.url;
        await mutateAsync({ id, ...updates, imageUrl });
      } else {
        await mutateAsync({ id, ...updates });
      }
    },
    [mutateAsync]
  );
  return { updateStory: storyUpdate, isLoading: isPending };
}

export function useDeleteSlidesForStory() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({storyId, slides}: {storyId: number, slides: SlideForm[]}) =>
      deleteSlidesForStory(storyId, slides),
  });
  return { deleteSlidesForStory: mutateAsync, isLoading: isPending };
}

export function useCreateSlidesForStory() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({storyId, slides}: {storyId: number, slides: SlideForm[]}) => {
      const slides_data = await Promise.all(
        slides.map(async (slide, index) => {
          const uploadResponse = await apiClient.uploadImage(slide.image.file!);
          return {
            slide_order: slide.slide_order,
            image_url: uploadResponse.data.url,
            caption: slide.caption,
            duration: slide.duration,
          };
        })
      );
      return createSlidesForStory(storyId, slides_data);
    }
  });
  return { createSlidesForStory: mutateAsync, isLoading: isPending };
}

export function useUpdateSlide() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({id, updates}: {id: number, updates: SlideUpdates}) =>
      updateSlide(id, updates),
  });
  return { updateSlide: mutateAsync, isLoading: isPending };
}


export function useTagsForStory(id?: number) {
  const {
    data: tags,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['tags', id],
    queryFn: () => fetchTagsForStory(id as number),
    enabled: !!id,
    staleTime: 5 * 1000, // 5 seconds
  });
  return { tags: tags ?? [], error, isLoading };
}

export function useSlidesForStory(id?: number) {
  const {
    data: slides,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['slides', id],
    queryFn: () => fetchSlidesForStory(id as number),
    enabled: !!id,
    staleTime: 5 * 1000, // 5 seconds
  });
  return { slides: slides ?? [], error, isLoading };
}

export function useStoryById(id?: number) {
  const {
    data: story,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['story', id],
    queryFn: () => fetchStoryById(id as number),
    enabled: !!id,
  });
  return { story, error, isLoading };
}

export const useWebStories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['webStories'],
    queryFn: () => fetchLatestWebStories(Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};

export const useGarhwalWebStories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['garhwalWebStories'],
    queryFn: () => fetchGarhwalWebStories(Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};

export const useKumaonWebStories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['kumaonWebStories'],
    queryFn: () => fetchKumaonWebStories(Number.MAX_SAFE_INTEGER, 10),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return { data, isLoading };
};
