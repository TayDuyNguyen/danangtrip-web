"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { InfoCircle } from "@/components/icons/solar";
import { Button, Loading } from "@/components/ui";
import { StandardPagination } from "@/components/ui/pagination";

import { FavoritesPageHeader } from "./FavoritesPageHeader";
import { FavoritesViewToggle } from "./FavoritesViewToggle";
import { FavoritesSortSelect } from "./FavoritesSortSelect";
import { FavoriteCardGrid } from "./FavoriteCardGrid";
import { FavoriteCardItem } from "./FavoriteCardItem";
import { FavoriteListItem } from "./FavoriteListItem";
import { FavoritesEmptyState } from "./FavoritesEmptyState";
import { FavoritesSkeleton } from "./FavoritesSkeleton";

import { useFavoritesQuery } from "../hooks/useFavoritesQuery";
import { useFavoriteMutation } from "../hooks/useFavoriteMutation";

export function FavoritesPageClient() {
  const t = useTranslations("favorites");
  
  // Client state
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"newest" | "oldest" | "name_asc" | "rating_desc">("newest");
  const [page, setPage] = useState<number>(1);
  const perPage = 12;

  // Track client-side transition loading
  const [isClientTransitioning, setIsClientTransitioning] = useState(false);

  // Track optimistically removing location IDs
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  // Fetch data (per_page: 100 for client-side sorting and paging)
  const { data: favoritesResponse, isLoading, isFetching, isError, refetch } = useFavoritesQuery({
    per_page: 100,
  });

  const { addFavorite, removeFavorite } = useFavoriteMutation();

  // Filter out invalid items (EC-02) and optimistically hidden items
  const allItems = useMemo(() => {
    return favoritesResponse?.data || [];
  }, [favoritesResponse]);

  const validItems = useMemo(() => {
    return allItems.filter(
      (item) => item.location !== null && item.location !== undefined
    );
  }, [allItems]);

  // Items currently visible on UI
  const visibleItems = useMemo(() => {
    return validItems.filter(
      (item) => item.location_id !== null && !removingIds.includes(item.location_id)
    );
  }, [validItems, removingIds]);

  // Sort items client-side
  const sortedItems = useMemo(() => {
    const itemsCopy = [...visibleItems];
    return itemsCopy.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sort === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sort === "name_asc") {
        return (a.location?.name || "").localeCompare(b.location?.name || "", "vi");
      }
      if (sort === "rating_desc") {
        const rA = parseFloat(a.location?.avg_rating || "0");
        const rB = parseFloat(b.location?.avg_rating || "0");
        return rB - rA;
      }
      return 0;
    });
  }, [visibleItems, sort]);

  // Pagination logic
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / perPage);

  // Adjust page if it exceeds totalPages — purely derived, no setState needed.
  const currentPage = page > totalPages ? Math.max(1, totalPages) : page;

  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * perPage;
    return sortedItems.slice(startIdx, startIdx + perPage);
  }, [sortedItems, currentPage]);

  const handleSortChange = (newSort: "newest" | "oldest" | "name_asc" | "rating_desc") => {
    setIsClientTransitioning(true);
    setSort(newSort);
    setPage(1);
    setTimeout(() => setIsClientTransitioning(false), 300);
  };

  const handlePageChange = (newPage: number) => {
    setIsClientTransitioning(true);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsClientTransitioning(false), 350);
  };

  const handleViewChange = (newView: "grid" | "list") => {
    setIsClientTransitioning(true);
    setView(newView);
    setTimeout(() => setIsClientTransitioning(false), 250);
  };

  // Optimistic delete and undo handler
  const handleRemove = (locationId: number) => {
    // Add to removing set immediately to animate out on UI
    setRemovingIds((prev) => [...prev, locationId]);

    // Send DELETE API call
    removeFavorite.mutate(
      { location_id: locationId },
      {
        onSuccess: () => {
          // Toast undo banner
          toast.success(t("toast_removed"), {
            duration: 5000,
            action: {
              label: t("undo"),
              onClick: () => {
                // Restore item on UI
                setRemovingIds((prev) => prev.filter((id) => id !== locationId));
                
                // Add back via POST
                addFavorite.mutate(
                  { location_id: locationId },
                  {
                    onSuccess: () => {
                      toast.success(t("toast_added_back"));
                    },
                    onError: () => {
                      toast.error(t("toast_undo_error"));
                      // Rollback UI (hide again)
                      setRemovingIds((prev) => [...prev, locationId]);
                    },
                  }
                );
              },
            },
          });
        },
        onError: () => {
          toast.error(t("toast_remove_error"));
          // Rollback: return item back to visible list
          setRemovingIds((prev) => prev.filter((id) => id !== locationId));
        },
      }
    );
  };

  return (
    <div className="space-y-6 min-h-screen pb-20">
      {/* Header and Counters */}
      <FavoritesPageHeader count={visibleItems.length} />

      {/* Control Panel (Sort & View Toggles) */}
      {validItems.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-[20px] border border-border bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:flex-row">
          <FavoritesSortSelect value={sort} onChange={handleSortChange} />
          <FavoritesViewToggle view={view} onChange={handleViewChange} />
        </div>
      )}

      {/* Grid or List content */}
      {isError ? (
        <div className="mx-auto max-w-xl rounded-[20px] border border-border bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <InfoCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="mb-4 font-semibold text-on-surface">{t("toast_remove_error")}</p>
          <Button
            onClick={() => refetch()}
            className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-primary-hover"
          >
            {t("retry")}
          </Button>
        </div>
      ) : isLoading ? (
        <FavoritesSkeleton view={view} />
      ) : (
        <div className="relative min-h-[250px] space-y-8">
          {(isFetching || isClientTransitioning) && !isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[1px] transition-all duration-300">
              <Loading type="spin" color="#FF385C" height={45} width={45} />
            </div>
          )}

          {visibleItems.length === 0 ? (
            <FavoritesEmptyState />
          ) : (
            <>
              {view === "grid" ? (
                <FavoriteCardGrid>
                  {paginatedItems.map((item) => (
                    <FavoriteCardItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      isRemoving={removingIds.includes(item.location_id || 0)}
                    />
                  ))}
                </FavoriteCardGrid>
              ) : (
                <div className="space-y-4">
                  {paginatedItems.map((item) => (
                    <FavoriteListItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      isRemoving={removingIds.includes(item.location_id || 0)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-4 flex justify-center">
                  <StandardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
