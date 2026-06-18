import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import type { RecommendedItem } from "../store/copilot.store";

const SESSION_KEY = "danangtrip_chat_session_id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId =
      Math.random().toString(36).substring(2) +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2);
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export interface ChatResponseMeta {
  intent?: string;
  is_in_scope?: boolean;
  cache_hit?: boolean;
  ai_nlu_triggered?: boolean;
  provider?: string;
  model?: string;
  tokens_used?: number;
  understanding?: Record<string, unknown>;
  clarification_step?: string;
}

/** Một lượt hội thoại truyền lên backend để AI hiểu ngữ cảnh */
export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatPageContext {
  page_type:
    | "home"
    | "general"
    | "location_list"
    | "location_detail"
    | "tour_list"
    | "tour_detail"
    | "tour_departures"
    | "blog_list"
    | "blog_detail"
    | "payment"
    | "booking_detail"
    | "profile";
  route: string;
  entity_type?: "location" | "tour" | "blog";
  entity_slug?: string;
}

export function buildChatPageContext(pathname: string): ChatPageContext {
  const route = pathname || "/";
  const segments = route.split("/").filter(Boolean);
  const normalizedSegments =
    segments[0] === "vi" || segments[0] === "en" ? segments.slice(1) : segments;
  const [section, slug, child] = normalizedSegments;

  if (section === "locations") {
    return slug
      ? {
          page_type: "location_detail",
          route,
          entity_type: "location",
          entity_slug: slug,
        }
      : { page_type: "location_list", route, entity_type: "location" };
  }

  if (section === "categories" && normalizedSegments[2] === "locations") {
    return { page_type: "location_list", route, entity_type: "location" };
  }

  if (section === "tours") {
    if (slug && child === "departures") {
      return {
        page_type: "tour_departures",
        route,
        entity_type: "tour",
        entity_slug: slug,
      };
    }

    return slug
      ? {
          page_type: "tour_detail",
          route,
          entity_type: "tour",
          entity_slug: slug,
        }
      : { page_type: "tour_list", route, entity_type: "tour" };
  }

  if (section === "tour-categories") {
    return { page_type: "tour_list", route, entity_type: "tour" };
  }

  if (section === "blog") {
    return slug
      ? {
          page_type: "blog_detail",
          route,
          entity_type: "blog",
          entity_slug: slug,
        }
      : { page_type: "blog_list", route, entity_type: "blog" };
  }

  if (section === "payment") {
    return { page_type: "payment", route };
  }

  if (section === "profile" && slug === "bookings" && child) {
    return { page_type: "booking_detail", route };
  }

  if (section === "profile") {
    return { page_type: "profile", route };
  }

  return {
    page_type: normalizedSegments.length === 0 ? "home" : "general",
    route,
  };
}

export const copilotService = {
  processMessage: async (
    message: string,
    locale: string = "vi",
    history: ConversationTurn[] = [],
    context?: ChatPageContext
  ): Promise<{
    text: string;
    recommendations: RecommendedItem[];
    suggested_questions: string[];
    center?: [number, number];
    zoom?: number;
    meta?: ChatResponseMeta;
  }> => {
    const sessionId = getOrCreateSessionId();
    const pageContext =
      context ??
      buildChatPageContext(
        typeof window !== "undefined" ? window.location.pathname : "/"
      );

    // Chỉ gửi tối đa 6 lượt cuối (3 user + 3 assistant) để tiết kiệm token
    const recentHistory = history.slice(-6);

    const response = await api.post<{
      text: string;
      answer?: string;
      recommendations?: RecommendedItem[];
      suggested_questions?: string[];
      center?: [number, number];
      zoom?: number;
      meta?: ChatResponseMeta;
    }>(API_ENDPOINTS.CHAT, {
      message,
      locale,
      session_id: sessionId,
      history: recentHistory,
      context: pageContext,
    });

    return {
      text: response.data?.text || response.data?.answer || "",
      recommendations: response.data?.recommendations || [],
      suggested_questions: response.data?.suggested_questions || [],
      center: response.data?.center,
      zoom: response.data?.zoom,
      meta: response.data?.meta,
    };
  },

  /**
   * Reset session — tạo session mới cho cuộc hội thoại mới.
   */
  resetSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
  },
};
