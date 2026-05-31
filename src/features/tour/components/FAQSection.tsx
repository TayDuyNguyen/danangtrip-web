"use client";

import { useState } from "react";
import { ChevronDown } from "@/components/icons/solar";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  title: string;
  items: FAQItem[];
}

export default function FAQSection({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-20 reveal-up">
      <h2 className="text-3xl font-black text-on-surface uppercase tracking-tight mb-8">
        {title}
      </h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div 
            key={index}
            className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[#fafafa]"
            >
              <span className="font-bold text-on-surface">
                {item.question}
              </span>
              <ChevronDown 
                className={cn(
                  "w-5 h-5 text-on-surface-subtle transition-transform duration-300",
                  openIndex === index && "rotate-180"
                )} 
              />
            </button>
            
            <div 
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="p-6 pt-0 text-on-surface-subtle leading-relaxed border-t border-border/50 mt-4 mx-6">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
