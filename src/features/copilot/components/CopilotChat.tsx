"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCopilotStore, ChatMessage } from "../store/copilot.store";
import { copilotService } from "../services/copilot.service";
import {
  Send,
  Sparkles,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import type { BlogPost, Location, Tour } from "@/types";
import { CopilotThinkingDots } from "./CopilotThinkingDots";

const formatMessageContent = (text: string) => {
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(
    /• (.*?)(?=(\n|$))/g,
    '<li class="ml-4 list-disc">$1</li>',
  );
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
            prev ? prev + " " + nextWord : nextWord,
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

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 max-w-[85%] animate-reveal-up",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-xs",
          isUser ? "bg-slate-200 text-slate-700" : "bg-primary text-white",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm min-w-0",
            isUser
              ? "bg-slate-800 text-white rounded-tr-none"
              : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50",
          )}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: formatMessageContent(displayedContent),
            }}
          />

          {!isStreaming &&
            msg.recommendations &&
            msg.recommendations.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-slate-200/50 pt-3">
                {msg.recommendations.map((item) => {
                  const isTour = item.type === "tour";
                  const isBlog = item.type === "blog";

                  if (isTour) {
                    const tour = item.data as Tour;
                    return (
                      <div
                        key={`bubble-tour-${tour.id}`}
                        className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col gap-1.5 shadow-2xs hover:border-primary/25 transition-all"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-bold text-xs text-slate-800 line-clamp-1">
                            🏖 {tour.name}
                          </span>
                          <span className="text-[10px] text-amber-500 font-bold shrink-0">
                            ⭐ {parseFloat(tour.avg_rating || "5.0").toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-black text-primary">
                            {parseFloat(tour.price_adult).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            đ
                          </span>
                          <Link
                            href={`${ROUTES.TOUR_DETAIL(tour.slug)}#booking-cta`}
                            className="px-2.5 py-1 text-[10px] font-bold text-white bg-primary rounded-md hover:bg-primary-hover shadow-2xs"
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
                        className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col gap-1.5 shadow-2xs hover:border-sky-500/25 transition-all"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-bold text-xs text-slate-800 line-clamp-2">
                            📖 {blog.title}
                          </span>
                          <span className="text-[10px] text-sky-600 font-bold shrink-0">
                            Bài viết
                          </span>
                        </div>
                        {blog.excerpt && (
                          <p className="text-[10px] text-slate-500 line-clamp-2">
                            {blog.excerpt}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-bold text-slate-500">
                            {blog.view_count?.toLocaleString("vi-VN") || 0} lượt
                            xem
                          </span>
                          <Link
                            href={ROUTES.BLOG_DETAIL(blog.slug)}
                            className="px-2.5 py-1 text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 rounded-md hover:bg-sky-100"
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
                        className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col gap-1.5 shadow-2xs hover:border-emerald-500/25 transition-all"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-bold text-xs text-slate-800 line-clamp-1">
                            🍜 {loc.name}
                          </span>
                          <span className="text-[10px] text-amber-500 font-bold shrink-0">
                            ⭐ {parseFloat(loc.avg_rating || "5.0").toFixed(1)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">
                          📍 {loc.address}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-bold text-emerald-600">
                            {loc.price_min
                              ? `${loc.price_min.toLocaleString("vi-VN")} đ`
                              : "Địa điểm hot"}
                          </span>
                          <div className="flex gap-1.5">
                            <Link
                              href={`/map?location_id=${loc.id}`}
                              className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md hover:bg-emerald-100"
                            >
                              Bản đồ
                            </Link>
                            <Link
                              href={ROUTES.LOCATION_DETAIL(loc.slug)}
                              className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
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

export default function CopilotChat() {
  const t = useTranslations("copilot");
  const locale = useLocale();
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    addMessage,
    setRecommendations,
    setMapCenter,
    setIsLoading,
  } = useCopilotStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

  const chips = [
    {
      label: "🏖 Tour Bà Nà Hills",
      query:
        locale === "vi" ? "Tour Bà Nà Hills tốt nhất" : "Best Ba Na Hills tour",
    },
    {
      label: "🍜 Ăn gì ở Đà Nẵng?",
      query:
        locale === "vi"
          ? "Ăn gì ở Đà Nẵng ngon bổ rẻ?"
          : "What to eat in Da Nang?",
    },
    {
      label: "📅 Lịch trình 3 ngày",
      query:
        locale === "vi"
          ? "Lịch trình du lịch 3 ngày"
          : "3-day Da Nang itinerary",
    },
    {
      label: "☕ Cafe view biển",
      query: locale === "vi" ? "cà phê view biển đẹp" : "seaview coffee shop",
    },
  ];

  const isWelcomeState = messages.filter((m) => m.role === "user").length === 0;

  return (
    <div className="flex h-full flex-col bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-slate-50/55 p-4 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
            🤖 DanangTrip AI
          </h3>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            {locale === "vi"
              ? "Trợ lý du lịch Đà Nẵng"
              : "Da Nang Travel Assistant"}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </p>
        </div>
      </div>

      {/* Chat Body */}
      {isWelcomeState ? (
        /* Welcome Screen state - Clean AI Concierge Layout */
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center space-y-6 bg-slate-50/20">
          <div className="space-y-1.5 text-center animate-reveal-up">
            <h3 className="text-xl font-extrabold text-slate-800">
              Xin chào 👋
            </h3>
            <p className="text-xs text-slate-500">
              {locale === "vi"
                ? "Tôi có thể giúp bạn:"
                : "I can help you with:"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/50 bg-white p-5 space-y-3 shadow-2xs max-w-md mx-auto w-full animate-reveal-up">
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                🏖{" "}
                <span className="font-semibold text-slate-800">Tìm tour:</span>{" "}
                Khám phá Bà Nà Hills, Phố cổ Hội An...
              </li>
              <li className="flex items-center gap-2">
                🍜{" "}
                <span className="font-semibold text-slate-800">
                  Tìm quán ăn:
                </span>{" "}
                Thưởng thức ẩm thực và hải sản đặc trưng.
              </li>
              <li className="flex items-center gap-2">
                ☕{" "}
                <span className="font-semibold text-slate-800">
                  Tìm quán cafe:
                </span>{" "}
                Điểm check-in view biển ngắm hoàng hôn.
              </li>
              <li className="flex items-center gap-2">
                📅{" "}
                <span className="font-semibold text-slate-800">
                  Lập lịch trình:
                </span>{" "}
                Lên kế hoạch vi vu Đà Nẵng 3 ngày 2 đêm.
              </li>
              <li className="flex items-center gap-2">
                🏨{" "}
                <span className="font-semibold text-slate-800">
                  Tìm khách sạn:
                </span>{" "}
                Lựa chọn phòng nghỉ gần biển Mỹ Khê.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto w-full pt-2 animate-reveal-up">
            {chips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip.query)}
                className="text-left rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Message logs rendering with streaming bubbles & feedback options */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            <div className="flex items-start gap-2.5 mr-auto max-w-[85%]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-100 border border-slate-200/50 px-4 py-3 text-sm text-slate-600 shadow-xs flex flex-col gap-1.5 animate-reveal-up">
                <span className="font-semibold text-[10px] text-slate-400">
                  DanangTrip AI đang trả lời...
                </span>
                <CopilotThinkingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border bg-slate-50/55 p-4 shrink-0">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
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
            className="flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            disabled={isLoading}
          />

          <button
            onClick={() => handleSend(inputVal)}
            disabled={!inputVal.trim() || isLoading}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm transition-all active:scale-95 cursor-pointer",
              !inputVal.trim() || isLoading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "hover:bg-primary-hover",
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
