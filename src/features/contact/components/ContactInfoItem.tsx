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
      <div className="w-12 h-12 rounded-xl bg-[#171717] border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
          {label}
        </h4>
        <p className="text-white font-medium text-lg lg:text-xl leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
};
