'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useArticlesByAuthor } from '@/features/article/hooks';
import { useArticleFilterHook } from '@/features/article/hooks/useArticleFilterHook';
import { useRouter } from 'next/navigation';
import { Plus} from 'lucide-react';
import Filter from '@/components/molecules/filter';
import Loading from '@/components/molecules/loading';
import { useAuthorId } from '@/features/author/hooks/useAuthorId';
import { ArticlesTableAuthorView } from '@/features/article/component/articles-table-authorview';

export default function ArticlesPage() {
  const router = useRouter();
  const authorId = useAuthorId()

  if(authorId === null){
    // redirect to login page
    router.replace('/login/author');
  }
  const { articles, error, isLoading } = useArticlesByAuthor(authorId!);
  const {
    filteredArticles,
    searchTerm,
    statusFilter,
    categoryFilter,
    regionFilter,
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setRegionFilter,
  } = useArticleFilterHook(articles);

  const handleCreateNew = () => {
    router.push('/author/articles/create');
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Articles Management</h1>
          <p className="text-muted-foreground">
            Manage and review all articles. Total: {filteredArticles.length} articles
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Article
        </Button>
      </div>

      {/* Filters */}
      <Filter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
      />

      {/* Articles Table */}
      <ArticlesTableAuthorView articles={filteredArticles} isLoading={isLoading} />
    </div>
  );
}
