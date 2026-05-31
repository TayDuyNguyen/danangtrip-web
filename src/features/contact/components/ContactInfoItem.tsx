import type { IconType } from "@/components/icons/solar";
import { cn } from "@/utils/string";

interface ContactInfoItemProps {
  icon: IconType;
  label: string;
  value: string;
  className?: string;
  delay?: string;
}

export const ContactInfoItem = ({
  icon: Icon,
  label,
  value,
  className,
  delay = "reveal-delay-100",
}: ContactInfoItemProps) => {
  return (
    <div className={cn("flex items-start gap-4 reveal-up", delay, className)}>
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-[#f7f7f7] transition-colors duration-300 group-hover:border-primary">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
          {label}
        </h4>
        <p className="text-lg font-medium leading-snug text-on-surface lg:text-xl">
          {value}
        </p>
      </div>
    </div>
  );
};
