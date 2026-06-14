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

export const copilotService = {
  processMessage: async (
    message: string,
    locale: string = "vi",
    history: ConversationTurn[] = []
  ): Promise<{
    text: string;
    recommendations: RecommendedItem[];
    suggested_questions: string[];
    center?: [number, number];
    zoom?: number;
    meta?: ChatResponseMeta;
  }> => {
    const sessionId = getOrCreateSessionId();

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
