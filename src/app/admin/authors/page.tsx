'use client';

import AuthorFilter from '@/components/molecules/author-filter';
import { Button } from '@/components/ui/button';
import Loading from '@/components/molecules/loading';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthors } from "@/features/author/hooks";
import { useAuthorFilterHook } from '@/features/author/hooks/useAuthorFilterHook';
import { AuthorsTable } from "@/features/author/components/authors-table";

export default function AuthorPage() {
    const router = useRouter();
    const { authors, error, isLoading } = useAuthors();
    const {
        filteredAuthors,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
    } = useAuthorFilterHook(authors);

    const handleCreateNew = () => {
        router.push('/admin/authors/create');
    };

    if (isLoading) {
        return <Loading />
    }
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Authors Management</h1>
                    <p className="text-muted-foreground">
                        Manage and review all authors. Total: {filteredAuthors.length} authors
                    </p>
                </div>
                <Button onClick={handleCreateNew} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Author
                </Button>
            </div>

            {/* Filters */}
            <AuthorFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}

            />

            {/* Authors Table */}
            <AuthorsTable authors={filteredAuthors} isLoading={isLoading} />
        </div>
    );
}

