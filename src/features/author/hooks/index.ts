import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAuthor, fetchAllAuthors, fetchAuthorByIdForView, setDeleteStatusAuthor, updateAuthor } from '@/features/author/services';
import React, { useCallback } from 'react';
import { Author, AuthorUpdates } from '../types';
import { ImageFile } from '@/types/common';
import { apiClient } from '@/lib/api';
import { deleteAuthor } from '@/features/author/services';

export function useCreateAuthor() {
    const [isCreating, setIsCreating] = React.useState(false);
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: ({
            name,
            email,
            profession,
            about,
            password,
            profile_photo_url,
        }: {
            name: string;
            email: string;
            profession: string;
            about: string;
            password: string;
            profile_photo_url: string;
        }) => createAuthor(name, email, profession, about, password, profile_photo_url),
        onSuccess: (data) => {
            queryClient.setQueryData(['allAuthors'], (oldData: Author[]) => {
                if (!oldData) {
                    return [data];
                }
                return [data, ...oldData];
            });
        },
    });

    const authorCreate = useCallback(
        async (
            name: string,
            email: string,
            profession: string,
            about: string,
            password: string,
            image: ImageFile
        ) => {
            setIsCreating(true);

            try {
                // Upload the image first
                const uploadResponse = await apiClient.uploadImage(image.file!);
                const profile_photo_url = uploadResponse.data.url;
                await mutateAsync({ name, email, profession, about, password, profile_photo_url });
            } catch (err: any) {
                setIsCreating(false);
                throw err;
            } finally {
                setIsCreating(false);
            }
        },
        [mutateAsync]
    );
    return [authorCreate, isCreating] as const;
}

export function useAuthors() {
    const {
        data: authors,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['allAuthors'],
        queryFn: () => fetchAllAuthors(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
    });
    return { authors, error, isLoading };
}

export function useAuthorById(id: number) {
    const {
        data: author,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['author', id],
        queryFn: () => fetchAuthorByIdForView(id),
        enabled: id !== undefined && id !== null && !isNaN(id),
    });
    return { author, error, isLoading };
}

export function useUpdateAuthor() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({
            id,
            name,
            email,
            profession,
            about,
            password,
            profile_photo_url,
        }: {
            id: number;
            name?: string;
            email?: string;
            profession?: string;
            about?: string;
            password?: string;
            profile_photo_url?: string;
        }) => updateAuthor(id, name, email, profession, about, password, profile_photo_url),
        onSuccess: (data) => {
            queryClient.setQueryData(['allAuthors'], (oldData: Author[]) => {
                return oldData.map((author) => {
                    if (author.id === data.id) {
                        return data;
                    }
                    return author;
                });
            });
        },
    });

    const authorUpdate = useCallback(
        async (id: number, updates: AuthorUpdates) => {
            if (updates.imageFile) {
                const uploadResponse = await apiClient.uploadImage(updates.imageFile.file!);
                const imageUrl = uploadResponse.data.url;
                await mutateAsync({
                    id,
                    name: updates.name,
                    email: updates.email,
                    profession: updates.profession,
                    about: updates.about,
                    password: updates.password,
                    profile_photo_url: imageUrl,
                });
            } else {
                await mutateAsync({
                    id,
                    name: updates.name,
                    email: updates.email,
                    profession: updates.profession,
                    about: updates.about,
                    password: updates.password,
                    profile_photo_url: updates.profile_photo_url,
                });
            }
        },
        [mutateAsync]
    );

    return { updateAuthor: authorUpdate, isLoading: isPending };
}

// Removes author with it's associated data from the cache
export function useDeleteAuthor() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (id: number) => deleteAuthor(id),
        onSuccess: (deleteAuthor: Author) => {
            queryClient.setQueryData(['allAuthors'], (oldData: Author[]) => {
                return oldData.filter((author) => author.id !== deleteAuthor.id);
            });
        },
    });

    return { deleteAuthor: mutateAsync, isLoading: isPending, error };
}

// Sets the is_active status of the author to 0 (soft delete) in the cache
export function useSetDeleteStatusAuthor() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (id: number) => setDeleteStatusAuthor(id),
        onSuccess: (updatedAuthor: Author) => {
            queryClient.setQueryData(['allAuthors'], (oldData: Author[]) => {
                if (!oldData) return [];
                return oldData.map((author) =>
                    author.id === updatedAuthor.id
                        ? { ...author, is_active: 0 }
                        : author
                );
            });
        },
    });

    return { deleteAuthor: mutateAsync, isLoading: isPending, error };
}