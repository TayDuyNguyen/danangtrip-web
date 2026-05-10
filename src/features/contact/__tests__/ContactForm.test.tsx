import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "../components/ContactForm";
import { useContactSubmit } from "../hooks/use-contact";
import type { ContactInput } from "../validators/contact.validator";

// Mock the hook
vi.mock("../hooks/use-contact", () => ({
  useContactSubmit: vi.fn(),
}));

describe("ContactForm", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useContactSubmit as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders all form fields", () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/form.name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/form.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/form.phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/form.subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/form.message/i)).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<ContactForm />);
    
    const submitBtn = screen.getByRole("button", { name: /form.submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/validation.name_min_2/i)).toBeInTheDocument();
      expect(screen.getByText(/validation.email_invalid/i)).toBeInTheDocument();
      expect(screen.getByText(/validation.message_min_10/i)).toBeInTheDocument();
    });
    
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls mutate when form is valid", async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/form.name/i), { target: { value: "Nguyễn Văn A" } });
    fireEvent.change(screen.getByLabelText(/form.email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/form.message/i), { target: { value: "Tôi muốn hỏi thông tin tour." } });
    
    const submitBtn = screen.getByRole("button", { name: /form.submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it("renders loading state when isPending is true", () => {
    (useContactSubmit as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<ContactForm />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/form.name/i)).toBeDisabled();
  });

  it("renders success screen when isSuccess is true", async () => {
    // In our component, isSuccess is internal state, so we need to simulate a successful mutate
    (useContactSubmit as Mock).mockImplementation(() => ({
      mutate: (data: ContactInput, { onSuccess }: { onSuccess: () => void }) => onSuccess(),
      isPending: false,
    }));

    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/form.name/i), { target: { value: "Nguyễn Văn A" } });
    fireEvent.change(screen.getByLabelText(/form.email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/form.message/i), { target: { value: "Tôi muốn hỏi thông tin tour." } });
    
    const submitBtn = screen.getByRole("button", { name: /form.submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/success.title/i)).toBeInTheDocument();
    });

    // Reset form
    const resetBtn = screen.getByRole("button", { name: /form.submit_another/i });
    fireEvent.click(resetBtn);
    
    expect(screen.getByLabelText(/form.name/i)).toBeInTheDocument();
  });
});
