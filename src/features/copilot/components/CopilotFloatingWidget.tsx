/* eslint-disable @next/next/no-img-element */
// cspell:disable
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  useCopilotStore,
  ChatMessage,
  ProcessingStep,
} from "../store/copilot.store";
import { copilotService } from "../services/copilot.service";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Gift,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ROUTES } from "@/config";
import type { BlogPost, Location, Tour } from "@/types";
import { CopilotThinkingDots } from "./CopilotThinkingDots";

// ============================================================
// Processing Steps Configuration
// ============================================================
const PROCESSING_STEPS: Record<
  NonNullable<ProcessingStep>,
  { icon: string; label: string; labelEn: string }
> = {
  understanding: {
    icon: "🤖",
    label: "Đang hiểu câu hỏi...",
    labelEn: "Understanding your question...",
  },
  searching: {
    icon: "🔍",
    label: "Đang tìm kiếm dữ liệu...",
    labelEn: "Searching for data...",
  },
  ranking: {
    icon: "⭐",
    label: "Đang chọn gợi ý phù hợp...",
    labelEn: "Selecting best matches...",
  },
  generating: {
    icon: "✍️",
    label: "Đang tạo câu trả lời...",
    labelEn: "Generating response...",
  },
};

// ============================================================
// Intent Badge Configuration
// ============================================================
const INTENT_BADGES: Record<
  string,
  { icon: string; label: string; labelEn: string; color: string }
> = {
  tour: {
    icon: "🏖",
    label: "Tour",
    labelEn: "Tour",
    color: "text-orange-600 bg-orange-50 border-orange-100",
  },
  food: {
    icon: "🍜",
    label: "Ẩm thực",
    labelEn: "Food",
    color: "text-green-600 bg-green-50 border-green-100",
  },
  hotel: {
    icon: "🏨",
    label: "Khách sạn",
    labelEn: "Hotel",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  location: {
    icon: "📍",
    label: "Địa điểm",
    labelEn: "Places",
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  blog: {
    icon: "📖",
    label: "Bài viết",
    labelEn: "Article",
    color: "text-sky-600 bg-sky-50 border-sky-100",
  },
  schedule: {
    icon: "📅",
    label: "Lịch trình",
    labelEn: "Itinerary",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  loyalty: {
    icon: "🎁",
    label: "Điểm thưởng",
    labelEn: "Rewards",
    color: "text-pink-600 bg-pink-50 border-pink-100",
  },
  payment: {
    icon: "💳",
    label: "Thanh toán",
    labelEn: "Payment",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  booking: {
    icon: "🎫",
    label: "Đặt tour",
    labelEn: "Booking",
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
};

// ============================================================
// Quick Reply Chips (based on intent)
// ============================================================

// ============================================================
// Location emoji helper — phân loại theo category
// ============================================================
function getLocationEmoji(loc: import("@/types").Location): string {
  const catName =
    typeof loc.category === "string"
      ? loc.category.toLowerCase()
      : typeof loc.category === "object" && loc.category !== null
      ? (loc.category.name ?? "").toLowerCase()
      : "";
  const name = (loc.name ?? "").toLowerCase();

  // Order matters — check most specific first
  if (/(cafe|c\u00e0 ph\u00ea|coffee|tr\u00e0 s\u1eefa|milk tea)/i.test(catName + name))
    return "\u2615";
  if (/(restaurant|nh\u00e0 h\u00e0ng|h\u1ea3i s\u1ea3n|seafood|\u0103n|qu\u00e1n|b\u00fan|ph\u1edf|b\u00e1nh|food|\u1ea9m th\u1ef1c)/i.test(catName + name))
    return "\ud83c\udf5c";
  if (/(hotel|kh\u00e1ch s\u1ea1n|resort|homestay|villa|motel)/i.test(catName + name))
    return "\ud83c\udfe8";
  if (/(beach|bi\u1ec3n|b\u1ea3i)/i.test(catName + name)) return "\ud83c\udfd6";
  if (/(mountain|n\u00fai|\u0111\u1ed3i)/i.test(catName + name)) return "\u26f0\ufe0f";
  if (/(museum|b\u1ea3o t\u00e0ng)/i.test(catName + name)) return "\ud83c\udfdb\ufe0f";
  if (/(temple|ch\u00f9a|church|nh\u00e0 th\u1edd|pagoda)/i.test(catName + name))
    return "\ud83d\uded5";
  if (/(park|c\u00f4ng vi\u00ean|garden|v\u01b0\u1eddn)/i.test(catName + name))
    return "\ud83c\udfd5\ufe0f";
  if (/(market|ch\u1ee3|shopping|shop)/i.test(catName + name)) return "\ud83d\udecd\ufe0f";
  if (/(island|\u0111\u1ea3o)/i.test(catName + name)) return "\ud83c\udf0a";
  if (/(entertainment|gi\u1ea3i tr\u00ed|bar|pub|club)/i.test(catName + name))
    return "\ud83c\udf89";
  return "\ud83d\udccd"; // default pin
}

// ============================================================
// Format message content
// ============================================================
const formatMessageContent = (text: string) => {
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(
    /• (.*?)(?=(\n|$))/g,
    '<li class="ml-4 list-disc">$1</li>'
  );
  html = html.replace(/\n/g, "<br />");
  return html;
};

// ============================================================
// Message Bubble Component
// ============================================================
function MessageBubble({
  msg,
  isLast,
  locale,
  onCopy,
  onFeedback,
  onQuickReply,
  onClarifySubmit,
}: {
  msg: ChatMessage;
  isLast: boolean;
  locale: string;
  onCopy: (text: string) => void;
  onFeedback: () => void;
  onQuickReply: (query: string) => void;
  onClarifySubmit?: (
    selectedIntents: string[],
    optionNotes: Record<string, string>,
    step: string | undefined,
    intent: string | undefined
  ) => void;
}) {
  const isUser = msg.role === "user";
  const t = useTranslations("copilot");
  const [displayedContent, setDisplayedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const wordsRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const [optionNotes, setOptionNotes] = useState<Record<string, string>>({});

  const options = useMemo(() => {
    const step = msg.meta?.clarification_step;
    const intent = msg.meta?.intent;

    if (step === "people") {
      return locale === "vi" ? [
        { id: "1-2", label: "Đoàn 1 - 2 người" },
        { id: "3-5", label: "Đoàn 3 - 5 người" },
        { id: "6-10", label: "Đoàn 6 - 10 người" },
        { id: "over10", label: "Đoàn trên 10 người" },
        { id: "other", label: "Số lượng khác (chưa có trong danh sách)" },
      ] : [
        { id: "1-2", label: "Group of 1 - 2 people" },
        { id: "3-5", label: "Group of 3 - 5 people" },
        { id: "6-10", label: "Group of 6 - 10 people" },
        { id: "over10", label: "Group of more than 10 people" },
        { id: "other", label: "Other quantity (not listed)" },
      ];
    }

    if (step === "destination") {
      return locale === "vi" ? [
        { id: "banahills", label: "Bà Nà Hills" },
        { id: "hoian", label: "Phố cổ Hội An" },
        { id: "sontra", label: "Bán đảo Sơn Trà" },
        { id: "nha-trang", label: "Ngũ Hành Sơn / Chùa Linh Ứng" },
        { id: "other", label: "Địa điểm khác (chưa có trong danh sách)" },
      ] : [
        { id: "banahills", label: "Ba Na Hills" },
        { id: "hoian", label: "Hoi An Ancient Town" },
        { id: "sontra", label: "Son Tra Peninsula" },
        { id: "nha-trang", label: "Marble Mountains / Linh Ung Pagoda" },
        { id: "other", label: "Other destination (not listed)" },
      ];
    }

    if (intent === "unknown") {
      return locale === "vi" ? [
        { id: "tour", label: "Tìm tour du lịch Bà Nà Hills, Hội An..." },
        { id: "food", label: "Khám phá địa điểm ăn uống, món ăn ngon" },
        { id: "hotel", label: "Tìm khách sạn, phòng nghỉ, chỗ ở" },
        { id: "blog", label: "Đọc cẩm nang du lịch, bài viết chia sẻ" },
        { id: "other", label: "Yêu cầu khác (chưa có trong danh sách trên)" },
      ] : [
        { id: "tour", label: "Search travel tours (Ba Na Hills, Hoi An...)" },
        { id: "food", label: "Explore dining spots & delicious food" },
        { id: "hotel", label: "Find hotels & accommodations" },
        { id: "blog", label: "Read travel blogs & guides" },
        { id: "other", label: "Other request (not in the list above)" },
      ];
    }

    return null;
  }, [msg.meta?.clarification_step, msg.meta?.intent, locale]);

  const getPromptLabel = () => {
    const step = msg.meta?.clarification_step;
    if (step === "people") {
      return locale === "vi" ? "Vui lòng chọn số lượng người dự kiến:" : "Please select the expected number of people:";
    }
    if (step === "destination") {
      return locale === "vi" ? "Vui lòng chọn địa điểm bạn muốn đi:" : "Please select the destination you want to visit:";
    }
    return locale === "vi" ? "Vui lòng tích chọn các mục bạn quan tâm:" : "Please select the options you are interested in:";
  };

  const handleSubmit = () => {
    if (onClarifySubmit && options && selectedIntents.length > 0) {
      onClarifySubmit(selectedIntents, optionNotes, msg.meta?.clarification_step, msg.meta?.intent);
      setSelectedIntents([]);
      setOptionNotes({});
    }
  };

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const firstType = msg.recommendations?.[0]?.type;
    return {
      tour: firstType === "tour" || !firstType,
      location: firstType === "location",
      blog: firstType === "blog",
    };
  });

  const groupedRecs = useMemo(() => {
    if (!msg.recommendations) return { tours: [], locations: [], blogs: [] };
    return {
      tours: msg.recommendations.filter((r) => r.type === "tour"),
      locations: msg.recommendations.filter((r) => r.type === "location"),
      blogs: msg.recommendations.filter((r) => r.type === "blog"),
    };
  }, [msg.recommendations]);

  const groupOrder = useMemo(() => {
    if (!msg.recommendations) return [];
    const types: string[] = [];
    msg.recommendations.forEach((r) => {
      if (r.type && !types.includes(r.type)) {
        types.push(r.type);
      }
    });
    // Ensure all 3 types are included in case they exist
    ["tour", "location", "blog"].forEach((t) => {
      if (!types.includes(t)) {
        types.push(t);
      }
    });
    return types;
  }, [msg.recommendations]);

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(msg.content);
      return;
    }

    const isRecent =
      new Date().getTime() - new Date(msg.timestamp).getTime() < 5000;
    if (isLast && isRecent) {
      setIsStreaming(true);
      const words = msg.content.split(" ");
      wordsRef.current = words;
      indexRef.current = 0;
      setDisplayedContent("");

      const interval = setInterval(() => {
        if (indexRef.current < wordsRef.current.length) {
          const nextWord = wordsRef.current[indexRef.current];
          setDisplayedContent((prev) =>
            prev ? prev + " " + nextWord : nextWord
          );
          indexRef.current++;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
        }
      }, 25);

      return () => clearInterval(interval);
    } else {
      setDisplayedContent(msg.content);
    }
  }, [msg.content, msg.timestamp, isLast, isUser]);

  const intent = msg.meta?.intent;
  const badge = intent ? INTENT_BADGES[intent] : null;
  // Ưu tiên suggested questions từ API (chính xác theo ngữ cảnh),
  // fallback về mảng rỗng nếu không có
  const quickReplies =
    msg.suggestedQuestions && msg.suggestedQuestions.length > 0
      ? msg.suggestedQuestions
      : null;

  return (
    <div
      className={cn(
        "flex items-start gap-2 max-w-[85%] animate-reveal-up",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold shadow-xs",
          isUser ? "bg-slate-200 text-slate-700" : "bg-primary text-white"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Bubble Container */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs min-w-0",
            isUser
              ? "bg-slate-800 text-white rounded-tr-none"
              : "bg-white text-slate-800 rounded-tl-none border border-slate-200/60"
          )}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: formatMessageContent(displayedContent),
            }}
          />

          {/* Embedded recommendation cards */}
          {!isStreaming &&
            msg.recommendations &&
            msg.recommendations.length > 0 && (
              <div className="mt-3 space-y-2.5 border-t border-slate-100 pt-3">
                {groupOrder.map((type) => {
                  if (type === "tour" && groupedRecs.tours.length > 0) {
                    return (
                      <div className="flex flex-col" key="group-tours">
                        <button
                          onClick={() =>
                            setExpandedGroups((prev) => ({
                              ...prev,
                              tour: !prev.tour,
                            }))
                          }
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-all shadow-3xs cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            🏕️ {t("chat.tours_title")} ({groupedRecs.tours.length})
                          </span>
                          {expandedGroups.tour ? (
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </button>
                        {expandedGroups.tour && (
                          <div className="mt-2 space-y-2 pl-1.5">
                            {groupedRecs.tours.map((item) => {
                              const tour = item.data as Tour;
                              return (
                                <div
                                  key={`bubble-tour-${tour.id}`}
                                  className="rounded-xl border border-slate-100 bg-slate-50/70 overflow-hidden shadow-2xs hover:border-primary/20 transition-all"
                                >
                                  {/* Thumbnail */}
                                  {tour.thumbnail && (
                                    <img
                                      src={tour.thumbnail}
                                      alt={tour.name}
                                      className="w-full h-20 object-cover"
                                    />
                                  )}
                                  <div className="p-2.5 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-start gap-1">
                                      <span className="font-bold text-[11px] text-slate-800 line-clamp-1">
                                        🏖 {tour.name}
                                      </span>
                                      <span className="text-[10px] text-amber-500 font-bold shrink-0">
                                        ⭐ {parseFloat(tour.avg_rating || "5.0").toFixed(1)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-black text-primary">
                                        {parseFloat(tour.price_adult).toLocaleString(
                                          "vi-VN"
                                        )}{" "}
                                        đ
                                      </span>
                                      <Link
                                        href={`${ROUTES.TOUR_DETAIL(tour.slug)}#booking-cta`}
                                        className="px-2 py-1 text-[9px] font-bold text-white bg-primary rounded-md hover:bg-primary-hover shadow-2xs"
                                      >
                                        {t("chat.book_now")}
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (type === "location" && groupedRecs.locations.length > 0) {
                    return (
                      <div className="flex flex-col" key="group-locations">
                        <button
                          onClick={() =>
                            setExpandedGroups((prev) => ({
                              ...prev,
                              location: !prev.location,
                            }))
                          }
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-all shadow-3xs cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            📍 {t("chat.locations_title")} ({groupedRecs.locations.length})
                          </span>
                          {expandedGroups.location ? (
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </button>
                        {expandedGroups.location && (
                          <div className="mt-2 space-y-2 pl-1.5">
                            {groupedRecs.locations.map((item) => {
                              const loc = item.data as Location;
                              return (
                                <div
                                  key={`bubble-loc-${loc.id}`}
                                  className="rounded-xl border border-slate-100 bg-slate-50/70 overflow-hidden shadow-2xs hover:border-emerald-500/20 transition-all"
                                >
                                  {/* Thumbnail */}
                                  {loc.thumbnail && (
                                    <img
                                      src={loc.thumbnail}
                                      alt={loc.name}
                                      className="w-full h-16 object-cover"
                                    />
                                  )}
                                  <div className="p-2.5 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-start gap-1">
                                      <span className="font-bold text-[11px] text-slate-800 line-clamp-1">
                                        {getLocationEmoji(loc)} {loc.name}
                                      </span>
                                      <span className="text-[10px] text-amber-500 font-bold shrink-0">
                                        ⭐ {parseFloat(loc.avg_rating || "5.0").toFixed(1)}
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 line-clamp-1">
                                      📍 {loc.address}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold text-emerald-600">
                                        {loc.price_min
                                          ? `${t("chat.price_from")} ${loc.price_min.toLocaleString("vi-VN")} đ`
                                          : loc.is_featured
                                          ? `⭐ ${t("chat.featured")}`
                                          : t("chat.free")}
                                      </span>
                                      <div className="flex gap-1">
                                        <Link
                                          href={`/map?location_id=${loc.id}`}
                                          className="px-2 py-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md hover:bg-emerald-100"
                                        >
                                          {t("chat.map")}
                                        </Link>
                                        <Link
                                          href={ROUTES.LOCATION_DETAIL(loc.slug)}
                                          className="px-2 py-1 text-[9px] font-bold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
                                        >
                                          {t("chat.view_detail")}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (type === "blog" && groupedRecs.blogs.length > 0) {
                    return (
                      <div className="flex flex-col" key="group-blogs">
                        <button
                          onClick={() =>
                            setExpandedGroups((prev) => ({
                              ...prev,
                              blog: !prev.blog,
                            }))
                          }
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-all shadow-3xs cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            📖 {t("chat.blogs_title")} ({groupedRecs.blogs.length})
                          </span>
                          {expandedGroups.blog ? (
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </button>
                        {expandedGroups.blog && (
                          <div className="mt-2 space-y-2 pl-1.5">
                            {groupedRecs.blogs.map((item) => {
                              const blog = item.data as BlogPost;
                              return (
                                <div
                                  key={`bubble-blog-${blog.id}`}
                                  className="rounded-xl border border-slate-100 bg-slate-50/70 overflow-hidden shadow-2xs hover:border-sky-500/20 transition-all"
                                >
                                  {/* Thumbnail */}
                                  {(blog as unknown as { featured_image?: string }).featured_image && (
                                    <img
                                      src={(blog as unknown as { featured_image?: string }).featured_image}
                                      alt={blog.title}
                                      className="w-full h-16 object-cover"
                                    />
                                  )}
                                  <div className="p-2.5 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-start gap-1">
                                      <span className="font-bold text-[11px] text-slate-800 line-clamp-2">
                                        📖 {blog.title}
                                      </span>
                                      <span className="text-[10px] text-sky-600 font-bold shrink-0">
                                        {t("chat.blogs_title")}
                                      </span>
                                    </div>
                                    {blog.excerpt && (
                                      <p className="text-[9px] text-slate-500 line-clamp-2">
                                        {blog.excerpt}
                                      </p>
                                    )}
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold text-slate-500">
                                        {blog.view_count?.toLocaleString("vi-VN") || 0}{" "}
                                        {t("chat.views")}
                                      </span>
                                      <Link
                                        href={ROUTES.BLOG_DETAIL(blog.slug)}
                                        className="px-2 py-1 text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-100 rounded-md hover:bg-sky-100"
                                      >
                                        {t("chat.read_post")}
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}


          {!isStreaming && !isUser && isLast && options !== null && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2.5">
              <p className="font-bold text-[10px] text-primary">
                {getPromptLabel()}
              </p>
              <div className="space-y-2">
                {options.map((opt) => (
                  <div key={opt.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 shadow-3xs flex flex-col gap-1.5 transition-all">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`opt-${msg.id}-${opt.id}`}
                        checked={selectedIntents.includes(opt.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIntents(prev => [...prev, opt.id]);
                          } else {
                            setSelectedIntents(prev => prev.filter(x => x !== opt.id));
                          }
                        }}
                        className="h-3.5 w-3.5 accent-primary cursor-pointer rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <label htmlFor={`opt-${msg.id}-${opt.id}`} className="text-[10px] font-bold text-slate-700 select-none cursor-pointer leading-normal flex-1">
                        {opt.label}
                      </label>
                    </div>
                    {selectedIntents.includes(opt.id) && (
                      <div className="ml-5.5 animate-reveal-up">
                        <input
                          type="text"
                          placeholder={locale === "vi" ? "Ghi chú thêm (không bắt buộc)..." : "Additional notes (optional)..."}
                          value={optionNotes[opt.id] || ""}
                          onChange={(e) => setOptionNotes(prev => ({ ...prev, [opt.id]: e.target.value }))}
                          className="w-full text-[10px] px-2 py-1.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none bg-white font-medium transition-all"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={selectedIntents.length === 0}
                className="w-full mt-1.5 py-2 px-3 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-1"
              >
                <Send className="h-3 w-3" />
                {locale === "vi" ? "Gửi phản hồi cho AI" : "Send Response to AI"}
              </button>
            </div>
          )}
        </div>

        {!isUser && !isStreaming && isLast && quickReplies && (
          <div className="mt-1 flex flex-wrap gap-1.5 animate-reveal-up">
            {quickReplies.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onQuickReply(q)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-600 hover:border-primary hover:text-primary transition-all cursor-pointer shadow-3xs hover:bg-primary/5 font-semibold"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Action feedback bar (assistant messages only) */}
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 flex-wrap">
            {/* Intent Badge */}
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[9px] font-semibold",
                  badge.color
                )}
              >
                {badge.icon} {locale === "vi" ? badge.label : badge.labelEn}
              </span>
            )}

            <button
              onClick={() => onFeedback()}
              className="flex items-center gap-0.5 hover:text-slate-600 hover:underline transition-all cursor-pointer"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>{t("chat.helpful")}</span>
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={() => onFeedback()}
              className="flex items-center gap-0.5 hover:text-slate-600 hover:underline transition-all cursor-pointer"
            >
              <ThumbsDown className="h-3 w-3" />
              <span>{t("chat.not_helpful")}</span>
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={() => onCopy(msg.content)}
              className="flex items-center gap-0.5 hover:text-slate-600 hover:underline transition-all cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              <span>{t("chat.copy")}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ============================================================
// Processing Indicator Component
// ============================================================
function ProcessingIndicator({
  step,
  locale,
}: {
  step: ProcessingStep;
  locale: string;
}) {
  if (!step) return null;

  const config = PROCESSING_STEPS[step];
  if (!config) return null;

  const label = locale === "vi" ? config.label : config.labelEn;

  return (
    <div className="flex items-start gap-2 mr-auto max-w-[85%]">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200/60 px-3.5 py-2.5 text-xs text-slate-600 shadow-xs flex flex-col gap-1.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <span className="text-sm">{config.icon}</span>
            <span className="font-semibold text-[10px] text-slate-500">
              {label}
            </span>
          </motion.div>
        </AnimatePresence>
        <CopilotThinkingDots />
      </div>
    </div>
  );
}

// ============================================================
// Main CopilotFloatingWidget
// ============================================================
export default function CopilotFloatingWidget() {
  const t = useTranslations("copilot");
  const locale = useLocale();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [inputVal, setInputVal] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(0);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    addMessage,
    setRecommendations,
    setMapCenter,
    setIsLoading,
    isOpen,
    setIsOpen,
    processingStep,
    setProcessingStep,
  } = useCopilotStore();

  // Show tooltip after pause
  useEffect(() => {
    if (isOpen || showTooltip) {
      return;
    }
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, showTooltip]);

  const tooltipSuggestions = useMemo(() => {
    const questions =
      locale === "vi"
        ? [
            {
              title: "Tìm tour phù hợp ngân sách",
              description:
                "Xem các tour đang mở bán theo mức giá bạn mong muốn.",
              query: "Có tour nào dưới 500 nghìn đồng không?",
            },
            {
              title: "Gợi ý lịch trình Đà Nẵng",
              description:
                "Lập kế hoạch tham quan theo số ngày và nhu cầu của bạn.",
              query: "Gợi ý lịch trình du lịch Đà Nẵng 3 ngày 2 đêm",
            },
            {
              title: "Khám phá món ngon địa phương",
              description:
                "Tìm quán ăn và đặc sản phù hợp trong dữ liệu DanangTrip.",
              query: "Ở Đà Nẵng nên ăn món gì và ở đâu?",
            },
            {
              title: "Địa điểm tham quan nổi bật",
              description:
                "Khám phá các điểm check-in, bãi biển và thắng cảnh đẹp ở Đà Nẵng.",
              query: "Các địa điểm tham quan nổi tiếng ở Đà Nẵng là gì?",
            },
            {
              title: "Tìm hiểu điểm thưởng",
              description: "Xem cách nhận điểm và đổi voucher giảm giá tour.",
              query: "Tôi có thể nhận điểm thưởng như thế nào?",
            },
            {
              title: "Hỏi về hủy tour và hoàn tiền",
              description:
                "Kiểm tra điều kiện hủy và chính sách hoàn tiền hiện hành.",
              query: "Chính sách hủy tour và hoàn tiền như thế nào?",
            },
          ]
        : [
            {
              title: "Find a tour for your budget",
              description:
                "Browse available tours that match your preferred price.",
              query: "Are there any tours under 500,000 VND?",
            },
            {
              title: "Plan a Da Nang itinerary",
              description: "Build a travel plan based on your available time.",
              query: "Suggest a 3-day 2-night Da Nang itinerary",
            },
            {
              title: "Discover local food",
              description:
                "Find local dishes and restaurants in DanangTrip data.",
              query: "What should I eat in Da Nang and where?",
            },
            {
              title: "Top attractions in Da Nang",
              description:
                "Explore famous check-in spots, beaches, and landmarks.",
              query: "What are the most famous attractions in Da Nang?",
            },
            {
              title: "Learn about reward points",
              description: "See how to earn points and redeem tour vouchers.",
              query: "How can I earn reward points?",
            },
            {
              title: "Ask about cancellations",
              description: "Check the current cancellation and refund policy.",
              query: "What is the tour cancellation and refund policy?",
            },
          ];

    if (isAuthenticated) {
      return questions.map((item) => ({ ...item, kind: "question" as const }));
    }

    return [
      {
        kind: "register" as const,
        title:
          locale === "vi"
            ? "Đăng ký để nhận ưu đãi và tích điểm"
            : "Sign up for offers and reward points",
        description:
          locale === "vi"
            ? "Viết đánh giá hữu ích, nhận điểm thưởng và đổi voucher giảm giá tour."
            : "Write helpful reviews, earn points, and redeem tour discount vouchers.",
        query:
          locale === "vi"
            ? "Tôi có thể nhận điểm thưởng như thế nào?"
            : "How can I earn reward points?",
      },
      ...questions.map((item) => ({ ...item, kind: "question" as const })),
    ];
  }, [isAuthenticated, locale]);

  useEffect(() => {
    if (!showTooltip || isOpen || isTooltipHovered || tooltipSuggestions.length < 2) {
      return;
    }
    const interval = window.setInterval(() => {
      setTooltipIndex((current) => (current + 1) % tooltipSuggestions.length);
    }, 9000);
    return () => window.clearInterval(interval);
  }, [isOpen, isTooltipHovered, showTooltip, tooltipSuggestions.length]);

  useEffect(() => {
    setTooltipIndex(0);
  }, [isAuthenticated, locale]);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, processingStep]);

  // Helper delay
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSend = async (textToSend: string, skipAddingUserMsg = false) => {
    if (!textToSend.trim() || isLoading) return;

    if (!skipAddingUserMsg) {
      addMessage({
        role: "user",
        content: textToSend,
      });
    }
    setInputVal("");
    setIsLoading(true);

    try {
      // === Step-by-step processing indicator ===
      setProcessingStep("understanding");
      await delay(400);

      setProcessingStep("searching");

      const historyTurns = (
        skipAddingUserMsg ? messages.slice(0, -1) : messages
      ).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Actual API call happens here
      const resPromise = copilotService.processMessage(
        textToSend,
        locale,
        historyTurns
      );

      await delay(700);
      setProcessingStep("ranking");
      await delay(400);
      setProcessingStep("generating");

      const res = await resPromise;

      addMessage({
        role: "assistant",
        content: res.text,
        recommendations: res.recommendations,
        suggestedQuestions: res.suggested_questions,
        meta: res.meta,
      });

      if (res.recommendations && res.recommendations.length > 0) {
        setRecommendations(res.recommendations);
      }

      if (res.center) {
        setMapCenter(res.center, res.zoom || 12);
      }
    } catch (err) {
      console.error(err);
      addMessage({
        role: "assistant",
        content: t("chat.error"),
      });
    } finally {
      setProcessingStep(null);
      setIsLoading(false);
    }
  };

  // Watch for programmatically added user messages
  useEffect(() => {
    if (messages.length === 0 || isLoading) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      void handleSend(lastMessage.content, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(inputVal);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép nội dung vào bộ nhớ tạm!");
  };

  const handleFeedback = () => {
    toast.success("Cảm ơn bạn đã đóng góp ý kiến phản hồi!");
  };

  const handleQuickReply = (query: string) => {
    handleSend(query);
  };

  const handleClarifySubmit = (
    selectedIds: string[],
    optionNotes: Record<string, string>,
    step: string | undefined,
    intent: string | undefined
  ) => {
    let optionsList: Array<{ id: string; label: string }> = [];

    if (step === "people") {
      optionsList = locale === "vi" ? [
        { id: "1-2", label: "Đoàn 1 - 2 người" },
        { id: "3-5", label: "Đoàn 3 - 5 người" },
        { id: "6-10", label: "Đoàn 6 - 10 người" },
        { id: "over10", label: "Đoàn trên 10 người" },
        { id: "other", label: "Số lượng khác (chưa có trong danh sách)" },
      ] : [
        { id: "1-2", label: "Group of 1 - 2 people" },
        { id: "3-5", label: "Group of 3 - 5 people" },
        { id: "6-10", label: "Group of 6 - 10 people" },
        { id: "over10", label: "Group of more than 10 people" },
        { id: "other", label: "Other quantity (not listed)" },
      ];
    } else if (step === "destination") {
      optionsList = locale === "vi" ? [
        { id: "banahills", label: "Bà Nà Hills" },
        { id: "hoian", label: "Phố cổ Hội An" },
        { id: "sontra", label: "Bán đảo Sơn Trà" },
        { id: "nha-trang", label: "Ngũ Hành Sơn / Chùa Linh Ứng" },
        { id: "other", label: "Địa điểm khác (chưa có trong danh sách)" },
      ] : [
        { id: "banahills", label: "Ba Na Hills" },
        { id: "hoian", label: "Hoi An Ancient Town" },
        { id: "sontra", label: "Son Tra Peninsula" },
        { id: "nha-trang", label: "Marble Mountains / Linh Ung Pagoda" },
        { id: "other", label: "Other destination (not listed)" },
      ];
    } else if (intent === "unknown") {
      optionsList = locale === "vi" ? [
        { id: "tour", label: "Tìm tour du lịch Bà Nà Hills, Hội An..." },
        { id: "food", label: "Khám phá địa điểm ăn uống, món ăn ngon" },
        { id: "hotel", label: "Tìm khách sạn, phòng nghỉ, chỗ ở" },
        { id: "blog", label: "Đọc cẩm nang du lịch, bài viết chia sẻ" },
        { id: "other", label: "Yêu cầu khác (chưa có trong danh sách trên)" },
      ] : [
        { id: "tour", label: "Search travel tours (Ba Na Hills, Hoi An...)" },
        { id: "food", label: "Explore dining spots & delicious food" },
        { id: "hotel", label: "Find hotels & accommodations" },
        { id: "blog", label: "Read travel blogs & guides" },
        { id: "other", label: "Other request (not in the list above)" },
      ];
    }

    const lines: string[] = [];
    selectedIds.forEach(id => {
      const opt = optionsList.find(o => o.id === id);
      if (opt) {
        const note = optionNotes[id]?.trim();
        if (note) {
          lines.push(`- ${opt.label} (${locale === "vi" ? "Ghi chú" : "Note"}: ${note})`);
        } else {
          lines.push(`- ${opt.label}`);
        }
      }
    });

    if (lines.length > 0) {
      const textToSend = (locale === "vi" ? "Tôi muốn:\n" : "I want to:\n") + lines.join("\n");
      handleSend(textToSend);
    }
  };

  // Quick suggestion chips for welcome screen
  const chips = [
    {
      label: "🏖 Tour Bà Nà Hills",
      query:
        locale === "vi"
          ? "Tour Bà Nà Hills giá rẻ nhất"
          : "Cheapest Ba Na Hills tour",
    },
    {
      label: "🍜 Ăn gì ở Đà Nẵng?",
      query:
        locale === "vi"
          ? "Quán ăn ngon ở Đà Nẵng món đặc sản hải sản"
          : "Best local food restaurants in Da Nang",
    },
    {
      label: "📅 Lịch trình 3 ngày",
      query:
        locale === "vi"
          ? "Lịch trình du lịch Đà Nẵng 3 ngày 2 đêm"
          : "3-day 2-night Da Nang travel itinerary",
    },
    {
      label: "☕ Cafe view biển",
      query:
        locale === "vi"
          ? "quán cà phê view biển đẹp ở Đà Nẵng"
          : "seaview cafe coffee shop Da Nang",
    },
  ];


  const isWelcomeState = messages.filter((m) => m.role === "user").length === 0;
  const activeTooltip = tooltipSuggestions[tooltipIndex % tooltipSuggestions.length];
  const dismissTooltip = () => {
    setTooltipIndex((current) => (current + 1) % tooltipSuggestions.length);
    setShowTooltip(false);
  };
  const showPreviousTooltip = () => {
    setTooltipIndex(
      (current) =>
        (current - 1 + tooltipSuggestions.length) % tooltipSuggestions.length
    );
  };
  const showNextTooltip = () => {
    setTooltipIndex((current) => (current + 1) % tooltipSuggestions.length);
  };

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end">
      {/* Tooltip nudge */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onMouseEnter={() => setIsTooltipHovered(true)}
            onMouseLeave={() => setIsTooltipHovered(false)}
            className="relative mb-3 mr-1 max-w-[290px] rounded-2xl border border-border bg-white px-4 py-3 text-xs text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {activeTooltip.kind === "register" ? (
                  <Gift className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${activeTooltip.kind}-${tooltipIndex}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <p className="font-bold leading-snug text-slate-900">
                      {activeTooltip.title}
                    </p>
                    <p className="min-h-8 text-[11px] leading-relaxed text-slate-600">
                      {activeTooltip.description}
                    </p>
                    <div className="flex items-center gap-2">
                      {activeTooltip.kind === "register" ? (
                        <Link
                          href={ROUTES.REGISTER}
                          onClick={dismissTooltip}
                          className="inline-flex rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-primary/20 hover:bg-primary-hover"
                        >
                          {locale === "vi" ? "Đăng ký ngay" : "Sign up"}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            void handleSend(activeTooltip.query);
                            dismissTooltip();
                            setIsOpen(true);
                          }}
                          className="inline-flex rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-primary/20 hover:bg-primary-hover"
                        >
                          {locale === "vi" ? "Hỏi AI" : "Ask AI"}
                        </button>
                      )}
                      {activeTooltip.kind === "register" && (
                        <button
                          type="button"
                          onClick={() => {
                            void handleSend(activeTooltip.query);
                            dismissTooltip();
                            setIsOpen(true);
                          }}
                          className="text-[11px] font-bold text-slate-600 hover:text-primary"
                        >
                          {locale === "vi" ? "Xem quy tắc" : "Rules"}
                        </button>
                      )}
                    </div>
                    <div className="flex gap-1 pt-0.5" aria-hidden="true">
                      {tooltipSuggestions.map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "h-1 rounded-full transition-all",
                            index === tooltipIndex
                              ? "w-4 bg-primary"
                              : "w-1 bg-slate-200"
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-1 border-t border-slate-100 pt-2">
                      <button
                        type="button"
                        aria-label={locale === "vi" ? "Gợi ý trước" : "Previous suggestion"}
                        onClick={showPreviousTooltip}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={locale === "vi" ? "Gợi ý tiếp theo" : "Next suggestion"}
                        onClick={showNextTooltip}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                aria-label={locale === "vi" ? "Đóng gợi ý" : "Close nudge"}
                onClick={(e) => {
                  e.stopPropagation();
                  dismissTooltip();
                }}
                className="shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="absolute bottom-[-6px] right-6 h-3 w-3 rotate-45 border-r border-b border-border bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 flex h-[540px] w-[350px] sm:w-[380px] flex-col rounded-2xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-linear-to-r from-primary to-rose-500 p-4 text-white shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black flex items-center gap-1.5">
                    🤖 DanangTrip AI
                  </h4>
                  <p className="text-[10px] text-white/95 flex items-center gap-1">
                    {locale === "vi"
                      ? "Trợ lý du lịch Đà Nẵng"
                      : "Da Nang Travel Assistant"}
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {isWelcomeState ? (
              /* Welcome Screen */
              <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-center space-y-5 bg-slate-50/50">
                <div className="space-y-1 text-center animate-reveal-up">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    Xin chào 👋
                  </h3>
                  <p className="text-xs text-slate-500">
                    {locale === "vi" ? "Tôi có thể giúp bạn:" : "I can help you with:"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/50 bg-white p-4 space-y-2.5 shadow-2xs animate-reveal-up">
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      🏖{" "}
                      <span className="font-semibold text-slate-800">Tìm tour:</span>{" "}
                      Khám phá Bà Nà Hills, Hội An, Cù Lao Chàm...
                    </li>
                    <li className="flex items-center gap-2">
                      🍜{" "}
                      <span className="font-semibold text-slate-800">Tìm quán ăn:</span>{" "}
                      Các quán hải sản ngon, quán ăn đặc sản.
                    </li>
                    <li className="flex items-center gap-2">
                      ☕{" "}
                      <span className="font-semibold text-slate-800">Tìm quán cafe:</span>{" "}
                      View biển đẹp, check-in sang xịn.
                    </li>
                    <li className="flex items-center gap-2">
                      📅{" "}
                      <span className="font-semibold text-slate-800">Lập lịch trình:</span>{" "}
                      Gợi ý lịch trình tham quan Đà Nẵng.
                    </li>
                    <li className="flex items-center gap-2">
                      🏨{" "}
                      <span className="font-semibold text-slate-800">Tìm khách sạn:</span>{" "}
                      Chỗ ở view biển, trung tâm tiện nghi.
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 animate-reveal-up">
                  {chips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(chip.query)}
                      className="text-left rounded-xl border border-slate-200 bg-white p-2.5 text-[11px] font-bold text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message list */
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isLast={idx === messages.length - 1}
                    locale={locale}
                    onCopy={handleCopy}
                    onFeedback={handleFeedback}
                    onQuickReply={handleQuickReply}
                    onClarifySubmit={handleClarifySubmit}
                  />
                ))}

                {/* Processing Indicator (replaces simple dots) */}
                {isLoading && (
                  <ProcessingIndicator step={processingStep} locale={locale} />
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Footer */}
            <div className="border-t border-slate-100 bg-white p-3 shrink-0">
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 focus-within:ring-1.5 focus-within:ring-primary/30 focus-within:border-primary focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    locale === "vi"
                      ? "Hỏi về tour, quán ăn hoặc lịch trình..."
                      : "Ask about tours, restaurants, or itineraries..."
                  }
                  className="flex-1 bg-transparent px-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400"
                  disabled={isLoading}
                />

                <button
                  onClick={() => handleSend(inputVal)}
                  disabled={!inputVal.trim() || isLoading}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-xs transition-all active:scale-95 cursor-pointer",
                    !inputVal.trim() || isLoading
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "hover:bg-primary-hover"
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          dismissTooltip();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tr from-primary to-rose-500 text-white shadow-[0_8px_24px_rgba(255,56,92,0.4)] hover:shadow-[0_8px_30px_rgba(255,56,92,0.6)] cursor-pointer focus:outline-none transition-shadow relative isolate"
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-rose-500 opacity-60 animate-ping z-[-1]" />
        )}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center"
            >
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
              <span className="absolute top-[-4px] right-[-4px] flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
