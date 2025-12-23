"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useStoriesByAuthor } from "@/features/web-story/hooks"
import { useRouter } from "next/navigation"
import { useStoryFilterHook, } from "@/features/web-story/hooks/useStoryFilterHook"
import { useAuthorId } from "@/features/author/hooks/useAuthorId"
import FilterStories from "@/components/molecules/filter-stories"
import { StoriesTableAuthor } from "@/features/web-story/component/stories-table-author"


export default function StoriesPage() {
  const router = useRouter()
  const authorId = useAuthorId()

  if (authorId === null) {
    // redirect to login page
    router.replace("/login/author")
  }

  const { stories, error, isLoading } = useStoriesByAuthor(authorId!)
  const { filteredStories, searchTerm, statusFilter, categoryFilter, regionFilter, setSearchTerm, setStatusFilter, setCategoryFilter, setRegionFilter } = useStoryFilterHook(stories)


  const handleCreateNew = () => {
    router.push("/author/stories/create")
  }


  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stories Management</h1>
            <p className="text-muted-foreground">
              Manage and review all web stories.
            </p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Story
          </Button>
        </div>

        {/* Filters */}
        <FilterStories
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
        />

        {/* Stories Table */}
        <StoriesTableAuthor
          stories={filteredStories}
          isLoading={isLoading}
        />
      </div>
  )
}
