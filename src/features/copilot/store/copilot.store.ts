import { create } from "zustand";
import type { BlogPost, Location, Tour } from "@/types";
import type { ChatResponseMeta } from "../services/copilot.service";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: RecommendedItem[];
  suggestedQuestions?: string[];
  meta?: ChatResponseMeta;
}

export interface RecommendedItem {
  type: "tour" | "location" | "blog";
  data: Tour | Location | BlogPost;
}

/** Các bước xử lý hiển thị cho user */
export type ProcessingStep =
  | "understanding"
  | "searching"
  | "ranking"
  | "generating"
  | null;

interface CopilotState {
  messages: ChatMessage[];
  recommendations: RecommendedItem[];
  selectedId: string | number | null;
  mapCenter: [number, number];
  mapZoom: number;
  isLoading: boolean;
  isOpen: boolean;
  processingStep: ProcessingStep;

  // Actions
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setRecommendations: (recommendations: RecommendedItem[]) => void;
  setSelectedId: (id: string | number | null) => void;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  setProcessingStep: (step: ProcessingStep) => void;
  reset: () => void;
}

const DEFAULT_CENTER: [number, number] = [16.0544, 108.2022]; // Da Nang center
const DEFAULT_ZOOM = 12;

export const useCopilotStore = create<CopilotState>((set) => ({
  messages: [],
  recommendations: [],
  selectedId: null,
  mapCenter: DEFAULT_CENTER,
  mapZoom: DEFAULT_ZOOM,
  isLoading: false,
  isOpen: false,
  processingStep: null,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
      ],
    })),

  setRecommendations: (recommendations) =>
    set({ recommendations, selectedId: null }),

  setSelectedId: (selectedId) => set({ selectedId }),

  setMapCenter: (mapCenter, mapZoom) =>
    set((state) => ({
      mapCenter,
      mapZoom: mapZoom !== undefined ? mapZoom : state.mapZoom,
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsOpen: (isOpen) => set({ isOpen }),

  setProcessingStep: (processingStep) => set({ processingStep }),

  reset: () =>
    set({
      messages: [],
      recommendations: [],
      selectedId: null,
      mapCenter: DEFAULT_CENTER,
      mapZoom: DEFAULT_ZOOM,
      isLoading: false,
      isOpen: false,
      processingStep: null,
    }),
}));
