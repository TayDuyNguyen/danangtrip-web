import { describe, it, expect } from "vitest";
import { contactSchema } from "../validators/contact.validator";

describe("contactSchema", () => {
  it("should validate correct data", () => {
    const validData = {
      name: "Nguyễn Duy Tây",
      email: "taynd@example.com",
      phone: "0905123456",
      subject: "Hỗ trợ đặt tour",
      message: "Tôi muốn hỏi về tour Bà Nà Hills ngày mai.",
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const invalidData = {
      name: "",
      email: "taynd@example.com",
      message: "Tôi muốn hỏi về tour Bà Nà Hills ngày mai.",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("name_min_2");
    }
  });

  it("should reject invalid email", () => {
    const invalidData = {
      name: "Nguyễn Duy Tây",
      email: "invalid-email",
      message: "Tôi muốn hỏi về tour Bà Nà Hills ngày mai.",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("email_invalid");
    }
  });

  it("should reject short message", () => {
    const invalidData = {
      name: "Nguyễn Duy Tây",
      email: "taynd@example.com",
      message: "Short",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("message_min_10");
    }
  });

  it("should reject invalid phone", () => {
    const invalidData = {
      name: "Nguyễn Duy Tây",
      email: "taynd@example.com",
      phone: "12345",
      message: "Tôi muốn hỏi về tour Bà Nà Hills ngày mai.",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("phone_invalid");
    }
  });
});
