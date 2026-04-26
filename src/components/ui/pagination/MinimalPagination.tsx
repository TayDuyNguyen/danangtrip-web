"use client";
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface MinimalPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const MinimalPagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
}: MinimalPaginationProps) => {
    const t = useTranslations('common');

    return (
        <div className="flex items-center justify-between gap-4 py-4 w-full">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#262626] text-[#d4d4d4] font-semibold text-sm bg-[#080808] hover:bg-[#171717] hover:text-[#8b6a55] hover:border-[#8b6a55] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
            >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline tracking-tight">{t('pagination.previous')}</span>
            </button>

            {/* Page Info */}
            <div className="flex flex-col items-center justify-center gap-0.5 px-6">
                <span className="text-xs font-bold text-[#737373] uppercase tracking-[0.2em] leading-none">
                    {t('pagination.page')}
                </span>
                <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-lg font-bold text-[#8b6a55]">
                        {currentPage}
                    </span>
                    <span className="text-sm font-bold text-[#404040]">
                        /
                    </span>
                    <span className="text-sm font-bold text-[#a3a3a3]">
                        {totalPages}
                    </span>
                </div>
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#262626] text-[#d4d4d4] font-semibold text-sm bg-[#080808] hover:bg-[#171717] hover:text-[#8b6a55] hover:border-[#8b6a55] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
            >
                <span className="hidden sm:inline tracking-tight">{t('pagination.next')}</span>
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default MinimalPagination;
