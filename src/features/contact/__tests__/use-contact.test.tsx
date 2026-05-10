import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useContactSubmit } from "../hooks/use-contact";
import { contactService } from "@/services/contact.service";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ContactInput } from "../validators/contact.validator";

// Mock services
vi.mock("@/services/contact.service", () => ({
  contactService: {
    submit: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientWrapper";
  return Wrapper;
};

describe("useContactSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call service and show success toast on success", async () => {
    const mockData: ContactInput = {
      name: "Test",
      email: "test@example.com",
      message: "Hello world 123",
      phone: "0123456789",
    };
    (contactService.submit as Mock).mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useContactSubmit(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contactService.submit).toHaveBeenCalledWith(mockData);
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show error toast on failure", async () => {
    const mockData: ContactInput = {
      name: "Test",
      email: "test@example.com",
      message: "Hello world 123",
      phone: "0123456789",
    };
    (contactService.submit as Mock).mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() => useContactSubmit(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockData);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalled();
  });
});
