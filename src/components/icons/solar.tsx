import type { ComponentType, SVGProps } from "react";
import {
  UilAngleDown,
  UilAngleDoubleLeft,
  UilAngleDoubleRight,
  UilAngleLeft,
  UilAngleRight,
  UilArrowRight,
  UilBag,
  UilBars,
  UilBedDouble,
  UilBoltAlt,
  UilBooks,
  UilBuilding,
  UilCalendarAlt,
  UilChartLine,
  UilCheck,
  UilCheckCircle,
  UilClock,
  UilCloud,
  UilCommentLines,
  UilCommentMessage,
  UilCompass,
  UilDirection,
  UilEnvelope,
  UilEstate,
  UilExclamationCircle,
  UilFacebookF,
  UilFire,
  UilGameStructure,
  UilGlobe,
  UilGrid,
  UilHeadphonesAlt,
  UilHeart,
  UilHeartAlt,
  UilInstagram,
  UilLock,
  UilLockAlt,
  UilMap,
  UilMapMarker,
  UilNewspaper,
  UilPhone,
  UilRefresh,
  UilRestaurant,
  UilRocket,
  UilSearch,
  UilShareAlt,
  UilShieldCheck,
  UilSlidersV,
  UilSlidersVAlt,
  UilStar,
  UilStarHalfAlt,
  UilThumbsUp,
  UilTimes,
  UilTrees,
  UilUmbrella,
  UilUser,
  UilUsersAlt,
  UilWallet,
  UilYoutube,
} from "@iconscout/react-unicons";

type SolarIconProps = SVGProps<SVGSVGElement> & {
  size?: string | number;
  color?: string;
};

export type IconType = ComponentType<SolarIconProps>;

// lucide-react compatibility exports
export const Check = UilCheck;
export const CheckCircle2 = UilCheckCircle;
export const ChevronDown = UilAngleDown;
export const ChevronLeft = UilAngleLeft;
export const ChevronRight = UilAngleRight;
export const ChevronsLeft = UilAngleDoubleLeft;
export const ChevronsRight = UilAngleDoubleRight;
export const Clock = UilClock;
export const Cloud = UilCloud;
export const Globe = UilGlobe;
export const Heart = UilHeart;
export const Map = UilMap;
export const MapPin = UilMapMarker;
export const MessageSquare = UilCommentMessage;
export const Phone = UilPhone;
export const Search = UilSearch;
export const Share2 = UilShareAlt;
export const SlidersHorizontal = UilSlidersV;
export const Star = UilStar;
export const StarHalf = UilStarHalfAlt;
export const ThumbsUp = UilThumbsUp;
export const Users = UilUsersAlt;
export const X = UilTimes;

// react-icons/io5 compatibility exports
export const IoAlertCircleOutline = UilExclamationCircle;
export const IoArrowForwardOutline = UilArrowRight;
export const IoBagHandleOutline = UilBag;
export const IoBedOutline = UilBedDouble;
export const IoBusinessOutline = UilBuilding;
export const IoCalendarOutline = UilCalendarAlt;
export const IoChevronBack = UilAngleLeft;
export const IoChevronBackOutline = UilAngleLeft;
export const IoChevronDownOutline = UilAngleDown;
export const IoChevronForward = UilAngleRight;
export const IoChevronForwardOutline = UilAngleRight;
export const IoCloseOutline = UilTimes;
export const IoCompassOutline = UilCompass;
export const IoEarthOutline = UilGlobe;
export const IoFingerPrintOutline = UilLockAlt;
export const IoFlame = UilFire;
export const IoFlashOutline = UilBoltAlt;
export const IoGameControllerOutline = UilGameStructure;
export const IoGridOutline = UilGrid;
export const IoHeadsetOutline = UilHeadphonesAlt;
export const IoHeart = UilHeart;
export const IoHeartOutline = UilHeartAlt;
export const IoHomeOutline = UilEstate;
export const IoLeafOutline = UilTrees;
export const IoLibraryOutline = UilBooks;
export const IoLocationOutline = UilMapMarker;
export const IoLockClosedOutline = UilLock;
export const IoLogoFacebook = UilFacebookF;
export const IoLogoInstagram = UilInstagram;
export const IoLogoYoutube = UilYoutube;
export const IoMailOutline = UilEnvelope;
export const IoMapOutline = UilMap;
export const IoMenuOutline = UilBars;
export const IoNewspaperOutline = UilNewspaper;
export const IoOptionsOutline = UilSlidersVAlt;
export const IoPeopleOutline = UilUsersAlt;
export const IoPersonOutline = UilUser;
export const IoRefreshOutline = UilRefresh;
export const IoRestaurantOutline = UilRestaurant;
export const IoRocketOutline = UilRocket;
export const IoSearchOutline = UilSearch;
export const IoShieldCheckmarkOutline = UilShieldCheck;
export const IoStar = UilStar;
export const IoTimeOutline = UilClock;
export const IoTrendingUp = UilChartLine;
export const IoUmbrellaOutline = UilUmbrella;
export const IoWalkOutline = UilDirection;
export const IoWalletOutline = UilWallet;

// react-icons/fa compatibility exports
export const FaQuoteLeft = UilCommentLines;
