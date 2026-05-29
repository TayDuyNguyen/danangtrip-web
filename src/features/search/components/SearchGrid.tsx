"use client";

import { SearchResult } from "../types/search.types";
import { SearchResultCard } from "./SearchResultCard";
import { SearchGridSkeleton } from "./SearchGridSkeleton";

interface SearchGridProps {
  results: SearchResult[];
  isLoading: boolean;
  onResultClick?: (item: SearchResult) => void;
}

export const SearchGrid = ({ results, isLoading, onResultClick }: SearchGridProps) => {
  if (isLoading) {
    return <SearchGridSkeleton />;
  }


  // Identify featured items (top 2 results based on bookings/views if they have is_featured or simply highest index)
  // For now, we'll take the first 2 results as "Featured" if they are hot/popular
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {results.map((result, index) => {
        // Simple logic for featured: first item is featured if results are few, 
        // or based on explicit 'featured' prop from our logic (Phase 4)
        const isFeatured = result.featured && index < 2;
        
        return (
          <SearchResultCard 
            key={`${result.type}-${result.id}`} 
            item={result} 
            index={index} 
            featured={isFeatured}
            onClick={onResultClick}
          />
        );
      })}
    </div>
  );
};
