'use client'
import { fetchAdmin } from "@/features/auth/services/admin";
import { Admin } from "@/features/auth/admin";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAuthors } from "@/features/auth/services/author";
import { Story } from "@/features/web-story/types";
import { Author } from "../author";
import { fetchAuthor } from "@/features/auth/services/author";

export function useAdmin() {
  const { data: admin, error, isLoading } = useQuery<Admin>({
    queryKey: ["admin"] as const,
    queryFn: fetchAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return { admin, error, isLoading };
}

export function useAuthor() {
  const {data: author, error, isLoading} = useQuery<Author> ({
    queryKey: ["author"] as const,
    queryFn: fetchAuthor,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return { author, error, isLoading };
}

export function useAuthors() {
  const { data: authors, error, isLoading } = useQuery({
    queryKey: ["allAuthors"] as const,
    queryFn: () => fetchAllAuthors(10000, 10), // Placeholder function
  })
  return { authors, error, isLoading };
}

export function useWebStories() {
  // TODO
  // Placeholder for fetching web stories from Redux or API
  // For now, we'll assume it's fetched from Redux
  return { webStories: [] as Story[], error:  null, isLoading:  false };
}