"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCopilotStore, ChatMessage } from "../store/copilot.store";
import { copilotService } from "../services/copilot.service";
import { X, Send, Sparkles, Bot, User, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ROUTES } from "@/config";
import type { BlogPost, Location, Tour } from "@/types";
import { getLocationMapsUrl } from "@/features/locations/utils/map-url";
import { CopilotThinkingDots } from "./CopilotThinkingDots";

const formatMessageContent = (text: string) => {
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/• (.*?)(?=(\n|$))/g, '<li class="ml-4 list-disc">$1</li>');
  html = html.replace(/\n/g, "<br />");
  return html;
};

// Message bubble sub-component to handle word-by-word streaming for new responses
function MessageBubble({
  msg,
  isLast,
  onCopy,
  onFeedback,
}: {
  msg: ChatMessage;
  isLast: boolean;
  onCopy: (text: string) => void;
  onFeedback: () => void;
}) {
  const isUser = msg.role === "user";
  const [displayedContent, setDisplayedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const wordsRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(msg.content);
      return;
    }

    // Only stream if it's the last message and it was created very recently (within 5 seconds)
    const isRecent = new Date().getTime() - new Date(msg.timestamp).getTime() < 5000;
    if (isLast && isRecent) {
      setIsStreaming(true);
      const words = msg.content.split(" ");
      wordsRef.current = words;
      indexRef.current = 0;
      setDisplayedContent("");

      const interval = setInterval(() => {
        if (indexRef.current < wordsRef.current.length) {
          const nextWord = wordsRef.current[indexRef.current];
          setDisplayedContent((prev) => (prev ? prev + " " + nextWord : nextWord));
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
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
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

          {/* Render embedded recommendation cards */}
          {!isStreaming && msg.recommendations && msg.recommendations.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
              {msg.recommendations.map((item) => {
                const isTour = item.type === "tour";
                const isBlog = item.type === "blog";
                
                if (isTour) {
                  const tour = item.data as Tour;
                  return (
                    <div
                      key={`bubble-tour-${tour.id}`}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 flex flex-col gap-1.5 shadow-2xs hover:border-primary/20 transition-all"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-[11px] text-slate-800 line-clamp-1">🏖 {tour.name}</span>
                        <span className="text-[10px] text-amber-500 font-bold shrink-0">⭐ {parseFloat(tour.avg_rating || "5.0").toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-black text-primary">
                          {parseFloat(tour.price_adult).toLocaleString("vi-VN")} đ
                        </span>
                        <Link
                          href={`${ROUTES.TOUR_DETAIL(tour.slug)}#booking-cta`}
                          className="px-2 py-1 text-[9px] font-bold text-white bg-primary rounded-md hover:bg-primary-hover shadow-2xs"
                        >
                          Đặt ngay
                        </Link>
                      </div>
                    </div>
                  );
                } else if (isBlog) {
                  const blog = item.data as BlogPost;
                  return (
                    <div
                      key={`bubble-blog-${blog.id}`}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 flex flex-col gap-1.5 shadow-2xs hover:border-sky-500/20 transition-all"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-[11px] text-slate-800 line-clamp-2">📖 {blog.title}</span>
                        <span className="text-[10px] text-sky-600 font-bold shrink-0">Bài viết</span>
                      </div>
                      {blog.excerpt && (
                        <p className="text-[9px] text-slate-500 line-clamp-2">{blog.excerpt}</p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] font-bold text-slate-500">
                          {blog.view_count?.toLocaleString("vi-VN") || 0} lượt xem
                        </span>
                        <Link
                          href={ROUTES.BLOG_DETAIL(blog.slug)}
                          className="px-2 py-1 text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-100 rounded-md hover:bg-sky-100"
                        >
                          Đọc bài
                        </Link>
                      </div>
                    </div>
                  );
                } else {
                  const loc = item.data as Location;
                  return (
                    <div
                      key={`bubble-loc-${loc.id}`}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 flex flex-col gap-1.5 shadow-2xs hover:border-emerald-500/20 transition-all"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-[11px] text-slate-800 line-clamp-1">🍜 {loc.name}</span>
                        <span className="text-[10px] text-amber-500 font-bold shrink-0">⭐ {parseFloat(loc.avg_rating || "5.0").toFixed(1)}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 line-clamp-1">📍 {loc.address}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] font-bold text-emerald-600">
                          {loc.price_min ? `${loc.price_min.toLocaleString("vi-VN")} đ` : "Địa điểm hot"}
                        </span>
                        <div className="flex gap-1">
                          <a
                            href={getLocationMapsUrl(loc)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md hover:bg-emerald-100"
                          >
                            Bản đồ
                          </a>
                          <Link
                            href={ROUTES.LOCATION_DETAIL(loc.slug)}
                            className="px-2 py-1 text-[9px] font-bold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* Action feedback bar (Shown only for assistant messages when not streaming) */}
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
            <button
              onClick={() => onFeedback()}
              className="flex items-center gap-0.5 hover:text-slate-600 hover:underline transition-all cursor-pointer"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Hữu ích</span>
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={() => onFeedback()}
              className="flex items-center gap-0.5 hover:text-slate-600 hover:underline transition-all cursor-pointer"
            >
              <ThumbsDown className="h-3 w-3" />
              <span>Chưa đúng</span>
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={() => onCopy(msg.content)}
              className="flex items-center gap-0.5 hover:text-slate-600 hover:underline transition-all cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CopilotFloatingWidget() {
  const t = useTranslations("copilot");
  const locale = useLocale();
  
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    addMessage,
    setRecommendations,
    setMapCenter,
    setIsLoading,
  } = useCopilotStore();

  // Tooltip trigger after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    addMessage({
      role: "user",
      content: textToSend,
    });
    setInputVal("");
    setIsLoading(true);

    try {
      const res = await copilotService.processMessage(textToSend, locale);
      addMessage({
        role: "assistant",
        content: res.text,
        recommendations: res.recommendations, // Save matching cards inside this message!
      });

      if (res.recommendations) {
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
      setIsLoading(false);
    }
  };

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

  // Quick suggestion chips
  const chips = [
    { label: "🏖 Tour Bà Nà Hills", query: locale === "vi" ? "Tour Bà Nà Hills tốt nhất" : "Best Ba Na Hills tour" },
    { label: "🍜 Ăn gì ở Đà Nẵng?", query: locale === "vi" ? "Ăn gì ở Đà Nẵng ngon bổ rẻ?" : "What to eat in Da Nang?" },
    { label: "📅 Lịch trình 3 ngày", query: locale === "vi" ? "Lịch trình du lịch 3 ngày" : "3-day Da Nang itinerary" },
    { label: "☕ Cafe view biển", query: locale === "vi" ? "cà phê view biển đẹp" : "seaview coffee shop" },
  ];

  // Helper to determine if we are in welcome screen state (no user queries sent yet)
  const isWelcomeState = messages.filter((m) => m.role === "user").length === 0;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-3 mr-1 max-w-[240px] rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-start gap-2 relative"
          >
            <div className="text-primary mt-0.5">✨</div>
            <div>
              <p>{locale === "vi" ? "Tôi là DanangTrip AI, bạn cần hỗ trợ gì không?" : "I'm DanangTrip AI, need any assistance?"}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
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
            className="mb-4 flex h-[520px] w-[350px] sm:w-[380px] flex-col rounded-2xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-primary to-rose-500 p-4 text-white shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black flex items-center gap-1.5">
                    🤖 DanangTrip AI
                  </h4>
                  <p className="text-[10px] text-white/95 flex items-center gap-1">
                    {locale === "vi" ? "Trợ lý du lịch Đà Nẵng" : "Da Nang Travel Assistant"}
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
              /* Welcome Screen state - Clean AI Concierge Layout */
              <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-center space-y-5 bg-slate-50/50">
                <div className="space-y-1 text-center animate-reveal-up">
                  <h3 className="text-lg font-extrabold text-slate-800">Xin chào 👋</h3>
                  <p className="text-xs text-slate-500">
                    {locale === "vi" ? "Tôi có thể giúp bạn:" : "I can help you with:"}
                  </p>
                </div>
                
                <div className="rounded-2xl border border-slate-200/50 bg-white p-4 space-y-2.5 shadow-2xs animate-reveal-up">
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">🏖 <span className="font-semibold text-slate-800">Tìm tour:</span> Khám phá Bà Nà Hills, Hội An, Cù Lao Chàm...</li>
                    <li className="flex items-center gap-2">🍜 <span className="font-semibold text-slate-800">Tìm quán ăn:</span> Các quán hải sản ngon, quán ăn đặc sản.</li>
                    <li className="flex items-center gap-2">☕ <span className="font-semibold text-slate-800">Tìm quán cafe:</span> View biển đẹp, check-in sang xịn.</li>
                    <li className="flex items-center gap-2">📅 <span className="font-semibold text-slate-800">Lập lịch trình:</span> Gợi ý lịch trình tham quan Đà Nẵng.</li>
                    <li className="flex items-center gap-2">🏨 <span className="font-semibold text-slate-800">Tìm khách sạn:</span> Chỗ ở view biển, trung tâm tiện nghi.</li>
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
              /* Message logs rendering with streaming bubbles & feedback options */
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isLast={idx === messages.length - 1}
                    onCopy={handleCopy}
                    onFeedback={handleFeedback}
                  />
                ))}

                {/* AI Concierge Bouncing Dots Typing Indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2 mr-auto max-w-[85%]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200/60 px-3.5 py-2.5 text-xs text-slate-600 shadow-xs flex flex-col gap-1.5">
                      <span className="font-semibold text-[10px] text-slate-400">DanangTrip AI đang trả lời...</span>
                      <CopilotThinkingDots />
                    </div>
                  </div>
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
                    (!inputVal.trim() || isLoading)
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

      {/* Toggle Button bubble */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-rose-500 text-white shadow-[0_8px_24px_rgba(255,56,92,0.4)] hover:shadow-[0_8px_30px_rgba(255,56,92,0.6)] cursor-pointer focus:outline-none transition-shadow relative isolate"
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-rose-500 opacity-60 animate-ping z-[-1]" />
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
