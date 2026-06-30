/** i18n copy mirrored from vi/en message files for resilient selectors. */
export const HOME_COPY = {
  vi: {
    nav: {
      home: "Trang chủ",
      locations: "Địa điểm",
      map: "Bản đồ",
      travel: "Tour du lịch",
      blog: "Cẩm nang",
      contact: "Liên hệ",
    },
    auth: { login: "Đăng nhập", register: "Đăng ký" },
    searchPlaceholder: "Bạn muốn đi đâu?",
    searchButton: "Tìm kiếm",
    heroTitle: "Khám phá Đà Nẵng",
    heroSlidesLabel: "Ảnh giới thiệu trang chủ",
    featuredToursTitle: "Tour Nổi bật",
    hotToursTitle: "Tour Hot Nhất Tuần",
    exploreMore: "Khám phá thêm",
    statsLocations: "Địa điểm",
    footerTerms: "Điều khoản dịch vụ",
    footerPrivacy: "Chính sách bảo mật",
    languageEn: "English",
    languageVi: "Tiếng Việt",
    prev: "Trước",
    next: "Tiếp theo",
    openMenu: "Mở menu",
  },
  en: {
    nav: {
      home: "Home",
      locations: "Places",
      map: "Map",
      travel: "Tours",
      blog: "Blog",
      contact: "Contact",
    },
    auth: { login: "Login", register: "Register" },
    searchPlaceholder: "Where do you want to go?",
    searchButton: "Search",
    heroTitle: "Explore Da Nang",
    heroSlidesLabel: "Homepage intro slides",
    featuredToursTitle: "Featured Tours",
    hotToursTitle: "Hottest Tours of the Week",
    exploreMore: "Explore more",
    statsLocations: "Places",
    footerTerms: "Terms of Service",
    footerPrivacy: "Privacy Policy",
    languageEn: "English",
    languageVi: "Tiếng Việt",
    prev: "Previous",
    next: "Next",
    openMenu: "Open menu",
  },
} as const;

export interface HomeSeedData {
  featuredTourName: string;
  featuredTourSlug: string;
  hotTourName: string;
  hotTourSlug: string;
  tourCategoryName: string;
  tourCategorySlug: string;
  locationCategoryName: string;
  locationCategorySlug: string;
  featuredLocationName: string;
  blogPostTitle: string;
}

export const EMPTY_HOME_SEED: HomeSeedData = {
  featuredTourName: "",
  featuredTourSlug: "",
  hotTourName: "",
  hotTourSlug: "",
  tourCategoryName: "",
  tourCategorySlug: "",
  locationCategoryName: "",
  locationCategorySlug: "",
  featuredLocationName: "",
  blogPostTitle: "",
};
