/** i18n copy mirrored from vi/en search message files. */
export const SEARCH_COPY = {
  vi: {
    inputLabel: "Bạn muốn đi đâu?",
    inputPlaceholder: "Nhập từ khóa tìm kiếm...",
    inputAction: "Tìm kiếm",
    tabs: { all: "Tất cả", tour: "Tour du lịch", location: "Địa điểm" },
    sort: {
      label: "Sắp xếp theo",
      popularity: "Phổ biến nhất",
      newest: "Mới nhất",
    },
    filters: { title: "Bộ lọc nâng cao", close: "Đóng bộ lọc", apply: "Áp dụng", reset: "Đặt lại" },
    empty: { title: "Không tìm thấy kết quả", subtitle: "Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc" },
    discovery: { title: "Khám phá Đà Nẵng", subtitle: "Gợi ý những trải nghiệm tuyệt vời nhất dành cho bạn" },
    trending: { title: "Xu hướng tìm kiếm" },
    suggestions: {
      locationsTitle: "📍 Địa điểm",
      toursTitle: "🗺 Tour du lịch",
      recentSearches: "Tìm kiếm gần đây",
    },
    badges: { tour: "Tour", location: "Địa điểm" },
    foundResultsPrefix: "Tìm thấy",
  },
  en: {
    inputLabel: "Where",
    inputPlaceholder: "Search for tours and places...",
    inputAction: "Search",
    tabs: { all: "All", tour: "Tours", location: "Locations" },
    sort: {
      label: "Sort by",
      popularity: "Most Popular",
      newest: "Newest",
    },
    filters: { title: "Filters", close: "Close filters", apply: "Apply", reset: "Reset" },
    empty: { title: "No results found", subtitle: "Try searching with different keywords or change the filters" },
    discovery: { title: "Discover Da Nang", subtitle: "Suggestions for the best experiences for you" },
    trending: { title: "Trending Searches" },
    suggestions: {
      locationsTitle: "📍 Locations",
      toursTitle: "🗺 Tours",
      recentSearches: "Recent searches",
    },
    badges: { tour: "Tour", location: "Location" },
    foundResultsPrefix: "Found",
  },
} as const;

export const SEARCH_QUERIES = {
  keyword: "Bà Nà",
  broad: "Đà Nẵng",
  empty: "zzzznotfound",
  suggestPrefix: "Ba",
} as const;

export type SearchSeedData = {
  tourName: string;
  tourSlug: string;
  locationName: string;
  locationSlug: string;
  suggestionTitle: string;
  tourTotal: number;
};

export const EMPTY_SEARCH_SEED: SearchSeedData = {
  tourName: "",
  tourSlug: "",
  locationName: "",
  locationSlug: "",
  suggestionTitle: "",
  tourTotal: 0,
};
