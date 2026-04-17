"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/types";
import Cookies from "js-cookie";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      clearError();

      try {
        const response = await authService.login(credentials);
        
        if (response.success && response.data) {
          const { user: userData, token: userToken, refreshToken } = response.data;

          if (userToken && userData) {
            storeLogin(userData, userToken);
            // Cookies are also handled in storeLogin, but we can set refreshToken here
            if (refreshToken) {
              Cookies.set("refreshToken", refreshToken, { expires: 30, path: "/" });
            }
            return { success: true };
          }
        }
        
        setError(response.message || "Login failed");
        return { success: false, error: response.message };
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, setLoading, setError, clearError]
  );

  const register = useCallback(
    async (credentials: RegisterRequest) => {
      setLoading(true);
      clearError();

      try {
        const response = await authService.register(credentials);
        
        if (response.success && response.data) {
          const { user: userData, token: userToken } = response.data;
          if (userData) {
            if (userToken) {
              storeLogin(userData, userToken);
            }
            return { success: true };
          }
        }
        
        setError(response.message || "Registration failed");
        return { success: false, error: response.message };
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, setLoading, setError, clearError]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      storeLogout();
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  }, [storeLogout]);

  const checkAuth = useCallback(async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const response = await authService.getMe();
      if (response.success && response.data) {
        storeLogin(response.data, token);
      } else {
        storeLogout();
      }
    } catch {
      storeLogout();
    } finally {
      setLoading(false);
    }
  }, [storeLogin, storeLogout, setLoading]);

  useEffect(() => {
    // Only check auth if we have a token but aren't authenticated in state
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token && !isAuthenticated) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
};

