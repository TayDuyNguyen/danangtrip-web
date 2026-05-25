/**
 * @file category-icon.ts
 * @description Single source of truth for mapping DB category icon keys
 * to React icon components (from @iconscout/react-unicons via solar.tsx).
 *
 * DB stores icon keys as kebab-case strings (e.g. "local-dining", "cafe-tea").
 * This map covers all 100 categories in the DaNangTrip database.
 *
 * Usage (web):
 *   import { resolveCategoryIcon } from '@/utils/category-icon';
 *   const Icon = resolveCategoryIcon(category.icon);
 *   return <Icon className="text-xl" />;
 */

import { createElement, type ComponentType, type SVGProps } from 'react';
import {
  IoRestaurantOutline,
  IoCoffeeOutline,
  IoGlassOutline,
  IoBedOutline,
  IoCameraOutline,
  IoLibraryOutline,
  IoLeafOutline,
  IoCompassOutline,
  IoUmbrellaOutline,
  IoFlame,
  IoShoppingBagOutline,
  IoFlashOutline,
  IoBusinessOutline,
  IoPlaneOutline,
  IoWrenchOutline,
  IoBriefcaseOutline,
  IoHomeOutline,
  IoGridOutline,
  IoMusicOutline,
  IoHardHatOutline,
  IoShieldOutline,
  IoPersonOutline,
  IoPeopleOutline,
  IoHeartOutline,
  IoTicketOutline,
  IoRocketOutline,
  IoMoonOutline,
} from '@/components/icons/solar';

type IconProps = SVGProps<SVGSVGElement> & { size?: string | number };
export type CategoryIconComponent = ComponentType<IconProps>;

/**
 * Maps every DB icon key → display icon component.
 * Keys are kebab-case strings exactly as stored in the `categories.icon` column.
 */
const CATEGORY_ICON_MAP: Record<string, CategoryIconComponent> = {
  // ── Ăn uống ──────────────────────────────────────────────────
  'local-dining': IoRestaurantOutline,
  'international-dining': IoRestaurantOutline,
  'seafood': IoRestaurantOutline,
  'cafe-tea': IoCoffeeOutline,
  'tea': IoCoffeeOutline,
  'pot': IoCoffeeOutline,           // lớp học nấu ăn
  'nightlife': IoGlassOutline,
  'glass': IoGlassOutline,          // rượu vang cao cấp

  // ── Lưu trú ──────────────────────────────────────────────────
  'luxury-stay': IoBedOutline,
  'accommodation': IoBedOutline,
  'stars': IoBedOutline,            // dịch vụ lưu trú cao cấp

  // ── Tham quan & Check-in ─────────────────────────────────────
  'camera': IoCameraOutline,
  'studio': IoCameraOutline,        // studio & phim trường
  'museum': IoLibraryOutline,
  'art': IoLibraryOutline,
  'archive': IoLibraryOutline,      // nghiên cứu văn hóa

  // ── Thiên nhiên & Ngoài trời ─────────────────────────────────
  'nature': IoLeafOutline,
  'mountain': IoLeafOutline,
  'leaf': IoLeafOutline,
  'carrot': IoLeafOutline,          // nông sản sạch
  'park': IoLeafOutline,

  // ── Tâm linh ─────────────────────────────────────────────────
  'temple': IoHomeOutline,

  // ── Phiêu lưu & Thể thao ngoài trời ─────────────────────────
  'tent': IoCompassOutline,         // cắm trại
  'boot': IoCompassOutline,         // leo núi
  'wind': IoCompassOutline,         // bay khinh khí cầu
  'air': IoCompassOutline,          // tour trực thăng
  'ticket': IoTicketOutline,        // vé tham quan
  'info': IoCompassOutline,         // thông tin du khách
  'swim': IoUmbrellaOutline,        // lặn biển
  'water-park': IoUmbrellaOutline,
  'moon': IoMoonOutline,            // chợ đêm

  // ── Mua sắm ──────────────────────────────────────────────────
  'shopping-mall': IoShoppingBagOutline,
  'local-market': IoShoppingBagOutline,
  'gift': IoShoppingBagOutline,
  'fashion': IoShoppingBagOutline,  // thời trang
  'flower': IoShoppingBagOutline,   // hoa tươi
  'beauty': IoShoppingBagOutline,   // mỹ phẩm
  'furniture': IoShoppingBagOutline, // đồ gia dụng
  'electronics': IoShoppingBagOutline, // điện máy

  // ── Thể thao & Sức khỏe ──────────────────────────────────────
  'sport': IoFlashOutline,
  'fitness': IoFlashOutline,
  'bolt': IoFlashOutline,           // xe điện
  'wellness': IoLeafOutline,
  'spa': IoLeafOutline,

  // ── Y tế ─────────────────────────────────────────────────────
  'hospital': IoBusinessOutline,
  'dentist': IoBusinessOutline,
  'pill': IoBusinessOutline,
  'test-tube': IoBusinessOutline,
  'shield': IoShieldOutline,        // thực phẩm chức năng
  'wheelchair': IoPersonOutline,    // hỗ trợ khuyết tật

  // ── Tài chính & Hành chính ───────────────────────────────────
  'government': IoBusinessOutline,
  'legal': IoBusinessOutline,
  'finance': IoBusinessOutline,
  'bank': IoBusinessOutline,
  'real-estate': IoBusinessOutline,
  'security': IoBusinessOutline,    // bảo vệ
  'file-text': IoBusinessOutline,   // kiểm toán
  'dollar': IoBusinessOutline,      // đối ngoại tài chính

  // ── Vận chuyển ───────────────────────────────────────────────
  'transport': IoPlaneOutline,
  'car-rental': IoPlaneOutline,
  'delivery': IoPlaneOutline,
  'post': IoPlaneOutline,
  'ship': IoPlaneOutline,           // hải quan

  // ── Giáo dục & Tri thức ──────────────────────────────────────
  'education': IoLibraryOutline,
  'book': IoLibraryOutline,
  'library': IoLibraryOutline,

  // ── Du lịch & Khám phá ───────────────────────────────────────
  'travel-agency': IoCompassOutline,
  'walk': IoCompassOutline,
  'compass': IoCompassOutline,

  // ── Nhà cửa & Sửa chữa ───────────────────────────────────────
  'home': IoHomeOutline,
  'construction': IoWrenchOutline,
  'tool': IoWrenchOutline,
  'craft': IoWrenchOutline,
  'gas': IoWrenchOutline,           // xăng dầu
  'laundry': IoWrenchOutline,       // giặt ủi
  'pet': IoWrenchOutline,           // thú y

  // ── Văn hóa & Nghệ thuật ─────────────────────────────────────
  'cinema': IoMusicOutline,
  'music': IoMusicOutline,
  'convention': IoMusicOutline,
  'flame': IoFlame,

  // ── Công nghệ & Văn phòng ────────────────────────────────────
  'work': IoBriefcaseOutline,       // coworking space
  'code': IoBriefcaseOutline,       // công ty phần mềm
  'rocket': IoRocketOutline,        // khởi nghiệp & tech hub
  'pen': IoBriefcaseOutline,        // thiết kế đồ họa
  'building': IoBriefcaseOutline,   // văn phòng đại diện
  'factory': IoBriefcaseOutline,    // khu công nghiệp
  'box': IoBriefcaseOutline,        // kho bãi & logistic
  'briefcase': IoBriefcaseOutline,  // tư vấn quản trị

  // ── Dịch vụ con người ────────────────────────────────────────
  'user': IoPersonOutline,          // chăm sóc người già
  'users': IoPeopleOutline,         // hoạt động cộng đồng
  'baby': IoPersonOutline,          // trông trẻ
  'heart': IoHeartOutline,          // tổ chức phi lợi nhuận / chụp ảnh cưới
  'translation': IoBriefcaseOutline, // dịch thuật & visa
  'printing': IoBriefcaseOutline,   // quảng cáo & in ấn
  'event': IoMusicOutline,          // tổ chức sự kiện
  'funeral': IoHomeOutline,         // dịch vụ tang lễ

  // ── Tiện ích ─────────────────────────────────────────────────
  'clock': IoFlashOutline,          // cửa hàng tiện lợi 24/7

  // ── Khoa học & Môi trường ────────────────────────────────────
  'globe': IoBriefcaseOutline,      // phát triển bền vững
  'cloud': IoLeafOutline,           // khí tượng thủy văn
  'hard-hat': IoHardHatOutline,     // an toàn lao động
  'ambulance': IoBusinessOutline,   // dịch vụ cứu hộ
};

/** Fallback icon when key is not found in the map */
const FALLBACK_ICON: CategoryIconComponent = IoGridOutline;

/**
 * Returns the icon component for a given DB category icon key.
 * Falls back to IoGridOutline if the key is unknown or null.
 *
 * @example
 * const Icon = resolveCategoryIcon('local-dining');
 * return <Icon className="text-xl" />;
 */
export function resolveCategoryIcon(iconKey: string | null | undefined): CategoryIconComponent {
  if (!iconKey) return FALLBACK_ICON;
  return CATEGORY_ICON_MAP[iconKey] ?? FALLBACK_ICON;
}

/**
 * Convenience component for inline use.
 * @example
 * <CategoryIconRenderer icon={cat.icon} className="text-xl" />
 */
export function CategoryIconRenderer({
  icon,
  className,
  size,
}: {
  icon: string | null | undefined;
  className?: string;
  size?: string | number;
}): React.ReactElement {
  return createElement(resolveCategoryIcon(icon), { className, size });
}
