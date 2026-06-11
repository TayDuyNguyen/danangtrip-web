"use client";

import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { shouldRetryQuery } from "@/lib/react-query";
import { LocaleHtmlLang } from "@/components/providers/LocaleHtmlLang";

const CartSync = dynamic(
  () =>
    import("@/features/cart/components/CartSync").then((mod) => mod.CartSync),
  { ssr: false },
);

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: shouldRetryQuery,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Asia/Ho_Chi_Minh"
      >
        <LocaleHtmlLang />
        <CartSync />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
