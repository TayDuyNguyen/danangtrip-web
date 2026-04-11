import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type Language = "vi" | "en";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
}

interface AppState {
  // UI State
  sidebar: SidebarState;
  theme: Theme;
  language: Language;
  isLoading: boolean;
  notifications: Notification[];

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapse: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setLoading: (isLoading: boolean) => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        sidebar: {
          isOpen: true,
          isCollapsed: false,
        },
        theme: "system",
        language: "vi",
        isLoading: false,
        notifications: [],

        toggleSidebar: () =>
          set((state) => ({
            sidebar: {
              ...state.sidebar,
              isOpen: !state.sidebar.isOpen,
            },
          })),

        setSidebarOpen: (isOpen) =>
          set((state) => ({
            sidebar: {
              ...state.sidebar,
              isOpen,
            },
          })),

        toggleSidebarCollapse: () =>
          set((state) => ({
            sidebar: {
              ...state.sidebar,
              isCollapsed: !state.sidebar.isCollapsed,
            },
          })),

        setTheme: (theme) => set({ theme }),

        setLanguage: (language) => set({ language }),

        setLoading: (isLoading) => set({ isLoading }),

        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              { ...notification, id: generateId() },
            ],
          })),

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: "app-storage",
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          sidebar: {
            isCollapsed: state.sidebar.isCollapsed,
          },
        }),
      }
    ),
    { name: "app-store" }
  )
);
