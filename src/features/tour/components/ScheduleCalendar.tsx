"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/utils/string";
import { ChevronLeft, ChevronRight } from "@/components/icons/solar";
import type { TourSchedule } from "@/types";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

interface ScheduleCalendarProps {
  schedules: TourSchedule[];
  selectedId?: number;
  onSelect: (id: number) => void;
}

export function ScheduleCalendar({ schedules, selectedId, onSelect }: ScheduleCalendarProps) {
  const locale = useLocale();
  const t = useTranslations("tour.detail");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const dateLocale = locale === "vi" ? vi : enUS;
  
  const startOfViewMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfViewMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  const daysInMonth = endOfViewMonth.getDate();
  const firstDayOfWeek = (startOfViewMonth.getDay() + 6) % 7; // T2 start

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const getScheduleForDate = (date: Date) => {
    return schedules.find(s => format(new Date(s.start_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`pad-${i}`} className="h-10" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const schedule = getScheduleForDate(date);
      const isAvailable = schedule && schedule.status === "available" && schedule.booking_availability === "open";
      const active = selectedId === schedule?.id;

      days.push(
        <div
          key={d}
          onClick={() => isAvailable && onSelect(schedule.id)}
          className={cn(
            "h-10 flex items-center justify-center text-sm rounded-full transition-all cursor-default relative group",
            isAvailable 
              ? "cursor-pointer hover:bg-primary/20 text-on-surface font-bold" 
              : "text-on-surface-subtle/30 line-through",
            active && "bg-primary text-white shadow-lg ring-2 ring-primary/50"
          )}
        >
          {d}
          {isAvailable && !active && (
            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full opacity-50" />
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-surface-container-low reveal-up text-white">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-black uppercase tracking-widest text-primary">
          {format(currentMonth, "MMMM yyyy", { locale: dateLocale })}
        </span>
        <div className="flex gap-2">
          <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg border border-border hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg border border-border hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(day => (
          <div key={day} className="text-[10px] font-bold text-on-surface-subtle uppercase opacity-50">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {selectedId && (
        <div className="mt-6 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-500">
           {schedules.filter(s => s.id === selectedId).map(s => {
             const available = s.max_people - s.booked_people;
             return (
               <div key={s.id} className="flex justify-between items-center">
                  <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                          {format(new Date(s.start_date), "EEEE, dd/MM/yyyy", { locale: dateLocale })}
                      </span>
                      <span className="text-[10px] text-success font-black uppercase">
                          {s.booking_availability === "open" ? `Còn ${available} chỗ` : t("schedule_full")}
                      </span>
                  </div>
                  <div className="w-16 h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <div 
                          className="h-full bg-primary" 
                          style={{ width: `${Math.min(100, (available / s.max_people) * 100)}%` }} 
                      />
                  </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
}
