import { Filter as FilterIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusAuthor } from "@/types/common"
import { Search } from "lucide-react"


interface FilterProps {
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
    statusFilter: string
    setStatusFilter: (statusFilter: string) => void
}
const AuthorFilter = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: FilterProps) => {

    return (
        <div className="bg-muted/30 flex flex-col gap-4 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
                <FilterIcon className="h-4 w-4" />
                Filters
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                        placeholder="Search author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value={StatusAuthor.Active}>Active</SelectItem>
                        <SelectItem value={StatusAuthor.Deleted}>Deleted</SelectItem>
                    </SelectContent>
                </Select>

            </div>
        </div>
    )
}

export default AuthorFilter;