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
  UilBox,
  UilBriefcase,
  UilBuilding,
  UilCalendarAlt,
  UilCamera,
  UilCarSideview,
  UilChartLine,
  UilCheck,
  UilCheckCircle,
  UilClock,
  UilCloud,
  UilCodeBranch,
  UilCommentLines,
  UilCommentMessage,
  UilCompass,
  UilCoffee,
  UilDirection,
  UilEnvelope,
  UilEstate,
  UilExclamationCircle,
  UilFacebookF,
  UilFire,
  UilGameStructure,
  UilGlassMartini,
  UilGlobe,
  UilGrid,
  UilHardHat,
  UilHeadphonesAlt,
  UilHeart,
  UilHeartAlt,
  UilHome,
  UilInstagram,
  UilLock,
  UilLockAlt,
  UilMap,
  UilMapMarker,
  UilMapPin,
  UilMoon,
  UilMusic,
  UilNewspaper,
  UilPhone,
  UilPlane,
  UilRefresh,
  UilRestaurant,
  UilRocket,
  UilSearch,
  UilShareAlt,
  UilShieldCheck,
  UilShield,
  UilShip,
  UilShoppingBag,
  UilSlidersV,
  UilSlidersVAlt,
  UilStar,
  UilStarHalfAlt,
  UilThumbsUp,
  UilTimes,
  UilTrees,
  UilTicket,
  UilTwitter,
  UilUtensils,
  UilUmbrella,
  UilUser,
  UilUsersAlt,
  UilWallet,
  UilWrench,
  UilYoutube,
  UilCopy,
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
export const Calendar = UilCalendarAlt;
export const InfoCircle = UilExclamationCircle;
export const ChatLine = UilCommentLines;

// react-icons/io5 compatibility exports
export const IoAlertCircleOutline = UilExclamationCircle;
export const IoArrowForwardOutline = UilArrowRight;
export const IoBagHandleOutline = UilBag;
export const IoBedOutline = UilBedDouble;
export const IoBoxOutline = UilBox;
export const IoBriefcaseOutline = UilBriefcase;
export const IoBusinessOutline = UilBuilding;
export const IoCalendarOutline = UilCalendarAlt;
export const IoCameraOutline = UilCamera;
export const IoCarSportOutline = UilCarSideview;
export const IoBicycleOutline = UilDirection;
export const IoBoatOutline = UilShip;
export const IoChevronBack = UilAngleLeft;
export const IoChevronBackOutline = UilAngleLeft;
export const IoChevronDownOutline = UilAngleDown;
export const IoChevronForward = UilAngleRight;
export const IoChevronForwardOutline = UilAngleRight;
export const IoCloseOutline = UilTimes;
export const IoCodeOutline = UilCodeBranch;
export const IoCompassOutline = UilCompass;
export const IoCoffeeOutline = UilCoffee;
export const IoEarthOutline = UilGlobe;
export const IoFingerPrintOutline = UilLockAlt;
export const IoFlame = UilFire;
export const IoFlashOutline = UilBoltAlt;
export const IoGameControllerOutline = UilGameStructure;
export const IoGlassOutline = UilGlassMartini;
export const IoGridOutline = UilGrid;
export const IoHardHatOutline = UilHardHat;
export const IoHeadsetOutline = UilHeadphonesAlt;
export const IoHeart = UilHeart;
export const IoHeartOutline = UilHeartAlt;
export const IoHomeOutline = UilEstate;
export const IoHouseOutline = UilHome;
export const IoLeafOutline = UilTrees;
export const IoLibraryOutline = UilBooks;
export const IoLocationOutline = UilMapMarker;
export const IoLockClosedOutline = UilLock;
export const IoLogoFacebook = UilFacebookF;
export const IoLogoInstagram = UilInstagram;
export const IoLogoYoutube = UilYoutube;
export const IoMailOutline = UilEnvelope;
export const IoMapOutline = UilMap;
export const IoMapPinOutline = UilMapPin;
export const IoMenuOutline = UilBars;
export const IoMoonOutline = UilMoon;
export const IoMusicOutline = UilMusic;
export const IoNewspaperOutline = UilNewspaper;
export const IoOptionsOutline = UilSlidersVAlt;
export const IoPeopleOutline = UilUsersAlt;
export const IoPersonOutline = UilUser;
export const IoPlaneOutline = UilPlane;
export const IoRefreshOutline = UilRefresh;
export const IoRestaurantOutline = UilRestaurant;
export const IoRocketOutline = UilRocket;
export const IoShieldOutline = UilShield;
export const IoSearchOutline = UilSearch;
export const IoShieldCheckmarkOutline = UilShieldCheck;
export const IoShoppingBagOutline = UilShoppingBag;
export const IoStar = UilStar;
export const IoTicketOutline = UilTicket;
export const IoTimeOutline = UilClock;
export const IoTrendingUp = UilChartLine;
export const IoUmbrellaOutline = UilUmbrella;
export const IoWalkOutline = UilDirection;
export const IoWalletOutline = UilWallet;
export const IoWrenchOutline = UilWrench;
export const IoUtensilsOutline = UilUtensils;
export const IoLogoTwitter = UilTwitter;
export const IoCopyOutline = UilCopy;
export const IoShareOutline = UilShareAlt;

// react-icons/fa compatibility exports
export const FaQuoteLeft = UilCommentLines;
