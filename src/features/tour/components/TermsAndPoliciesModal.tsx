"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { X, Check } from "@/components/icons/solar";

interface TermsAndPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "policy" | null;
}

type ModalTable = {
  headers: string[];
  rows: string[][];
};

type ModalSection = {
  title: string;
  body?: string;
  items?: string[];
  note?: string;
  table?: ModalTable;
  variant?: "callout";
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, duration: 0.5, bounce: 0.2 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
  },
};

export function TermsAndPoliciesModal({ isOpen, onClose, type }: TermsAndPoliciesModalProps) {
  const t = useTranslations("tour.booking.terms_modal");

  if (!isOpen || !type) return null;

  const sections = t.raw(`${type}.sections`) as ModalSection[];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[5px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        onClick={onClose}
      >
        <motion.div
          className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-[28px] border border-border bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8"
          variants={modalVariants}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 cursor-pointer rounded-full border border-border bg-[#fafafa] p-2 text-on-surface-subtle transition-all duration-200 hover:border-primary/25 hover:bg-white hover:text-on-surface active:scale-95"
            aria-label={t("close_aria")}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="border-b border-border/60 pb-4 pr-12">
            <h2 id="terms-modal-title" className="text-xl font-black uppercase tracking-tight text-on-surface sm:text-2xl">
              {t(`${type}.title`)}
            </h2>
            <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-wider text-primary">{t("eyebrow")}</p>
          </div>

          <div className="scrollbar-thin flex-1 space-y-6 overflow-y-auto py-6 pr-1 text-sm leading-relaxed text-on-surface">
            {sections.map((section) => (
              <PolicySection key={section.title} section={section} />
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-border/60 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-primary px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 active:scale-95 sm:text-sm"
            >
              <Check className="h-4 w-4" />
              <span>{t("confirm")}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PolicySection({ section }: { section: ModalSection }) {
  const isCallout = section.variant === "callout";

  return (
    <section className={isCallout ? "space-y-2.5 rounded-2xl border border-primary/10 bg-primary/5 p-4" : "space-y-2.5"}>
      <h3
        className={
          isCallout
            ? "flex items-center gap-1.5 text-[14px] font-black text-primary"
            : "border-l-3 border-primary pl-2.5 text-[15px] font-black text-[#0F172A]"
        }
      >
        {isCallout && <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />}
        {section.title}
      </h3>

      {section.body && <p className={bodyClassName(isCallout)}>{section.body}</p>}

      {section.table && <PolicyTable table={section.table} />}

      {section.items && (
        <ul className="list-disc space-y-1.5 pl-8 text-[13px] font-medium text-on-surface-subtle">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {section.note && <p className="pl-3.5 text-[13px] font-medium leading-relaxed text-on-surface-subtle">{section.note}</p>}
    </section>
  );
}

function PolicyTable({ table }: { table: ModalTable }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-xs font-semibold text-on-surface-subtle">
        <thead>
          <tr className="border-b border-border bg-slate-50 text-[10px] font-black uppercase text-[#94A3B8]">
            {table.headers.map((header, index) => (
              <th key={header} className={`p-3 ${index > 0 ? "text-right" : ""}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40 font-medium">
          {table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className={`p-3 ${index > 0 ? "text-right font-extrabold text-[#0F172A]" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function bodyClassName(isCallout: boolean): string {
  return isCallout
    ? "mt-2.5 text-[13px] font-medium leading-relaxed text-on-surface-subtle"
    : "pl-3.5 text-[13px] font-medium leading-relaxed text-on-surface-subtle";
}
