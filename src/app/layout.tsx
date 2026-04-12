import { ReactNode } from "react";

// This layout is required by Next.js for the root segment (/).
// Since we use dynamic [locale] routing, this layout will simply 
// pass children through to the localized layouts.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
