"use client";

import { SearchResult } from "../types/search.types";
import { SearchResultCard } from "./SearchResultCard";

interface SearchGridProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const SearchGrid = ({ results, isLoading }: SearchGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <SearchResultCard key={i} isLoading index={i} />
        ))}
      </div>
    );
  }

  // Identify featured items (top 2 results based on bookings/views if they have is_featured or simply highest index)
  // For now, we'll take the first 2 results as "Featured" if they are hot/popular
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          />
        );
      })}
    </div>
  );
};
