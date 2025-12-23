import { Filter as FilterIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Status } from "@/types/common"
import { Search } from "lucide-react"
import { Category, Region } from "@/types/common"



interface FilterProps {
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
    statusFilter: string
    setStatusFilter: (statusFilter: string) => void
    categoryFilter: string
    setCategoryFilter: (categoryFilter: string) => void
    regionFilter: string
    setRegionFilter: (regionFilter: string) => void
}
const FilterStories = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, regionFilter, setRegionFilter }: FilterProps) => {

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
              placeholder="Search stories..."
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
              <SelectItem value={Status.Draft}>Draft</SelectItem>
              <SelectItem value={Status.Pending}>Pending</SelectItem>
              <SelectItem value={Status.Approved}>Approved</SelectItem>
              <SelectItem value={Status.Rejected}>Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(Category).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Region Filter */}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Object.entries(Region).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
}

export default FilterStories;