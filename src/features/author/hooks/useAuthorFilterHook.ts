import { useDeepCompareMemo } from 'use-deep-compare'
import { useState } from 'react'
import { Author } from '@/features/author/types'

export const useAuthorFilterHook = (authors?: Author[]) => {

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const filteredAuthors = useDeepCompareMemo(() => {
        let filtered = authors ?? []

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(author =>
                author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                author.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply status filter
        if (statusFilter !== "all") {
            const statusValue = parseInt(statusFilter);
            filtered = filtered.filter(author => author.is_active === statusValue)
        }

        return filtered
    }, [authors, searchTerm, statusFilter])

    return { filteredAuthors, searchTerm, statusFilter, setSearchTerm, setStatusFilter }

}