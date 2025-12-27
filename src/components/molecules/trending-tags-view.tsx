"use client"

import { TrendingUp } from "lucide-react"
import TagBadge from "./tag-badge"

export function TrendingTagsView({ trendingTags, handleTagClick }: { trendingTags?: string[], handleTagClick: (tag: string) => void }) {

  // Fallback tags if API doesn't return any
  const fallbackTags = [
    "Hill Farming",
    "Char Dham Yatra", 
    "Dehradun Development",
    "Tourism Revival",
    "Mountain Wildlife",
    "Sustainable Development",
    "Uttarakhand Elections",
    "Culture Heritage"
  ]

  if (!trendingTags) {
    trendingTags = fallbackTags
  }

  const displayTags = trendingTags.length > 0 ? trendingTags : fallbackTags

  return (
    <div className="overflow-hidden relative max-w-full">
      <div className="relative py-3">
        {/* Trending Label with Arrow - Positioned more to the left, completely square */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 flex items-center text-red-500 bg-white px-4 py-2">
          <TrendingUp className="h-10 w-4 mr-1" />
          <span className="text-sm font-large">Trending:</span>
        </div>
        
        {/* Full Width Scrolling Tags Container - Tags start from behind the trending label */}
        <div className="w-full relative overflow-hidden h-10">
          <div className="flex absolute top-0 left-0 h-full animate-scroll duration-600 infinite">
            {/* First set of tags - starts from very beginning to go behind trending label */}
            <div className="flex items-center space-x-3 whitespace-nowrap ml-2">
              {displayTags.map((tag, index) => (
                <TagBadge key={index} tag={tag} />
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center space-x-3 whitespace-nowrap ml-3">
              {displayTags.map((tag, index) => (
                <TagBadge key={index} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingTagsView;

