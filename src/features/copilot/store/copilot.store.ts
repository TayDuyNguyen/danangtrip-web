import { create } from "zustand";
import type { BlogPost, Location, Tour } from "@/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: RecommendedItem[];
}

export interface RecommendedItem {
  type: "tour" | "location" | "blog";
  data: Tour | Location | BlogPost;
}

interface CopilotState {
  messages: ChatMessage[];
  recommendations: RecommendedItem[];
  selectedId: string | number | null;
  mapCenter: [number, number];
  mapZoom: number;
  isLoading: boolean;
  isOpen: boolean;
  
  // Actions
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setRecommendations: (recommendations: RecommendedItem[]) => void;
  setSelectedId: (id: string | number | null) => void;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
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

  reset: () =>
    set({
      messages: [],
      recommendations: [],
      selectedId: null,
      mapCenter: DEFAULT_CENTER,
      mapZoom: DEFAULT_ZOOM,
      isLoading: false,
      isOpen: false,
    }),
}));
