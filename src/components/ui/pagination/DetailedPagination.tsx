"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface DetailedPaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
}

const DetailedPagination = ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100]
}: DetailedPaginationProps) => {
    const t = useTranslations('common');
    const [jumpToPage, setJumpToPage] = useState<string>('');

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const handleJumpToPage = (e: React.FormEvent) => {
        e.preventDefault();
        const page = parseInt(jumpToPage);
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            setJumpToPage('');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-6 border-t border-[#262626] mt-4">
            {/* Left: Summary and Page Size */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                <p className="text-sm font-semibold text-[#a3a3a3] whitespace-nowrap">
                    {t('pagination.showing')} <span className="text-[#8b6a55]">{startItem}</span> {t('pagination.to')} <span className="text-[#8b6a55]">{endItem}</span> {t('pagination.of')} <span className="text-white">{totalItems}</span> {t('pagination.results')}
                </p>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#a3a3a3] whitespace-nowrap">
                        {t('pagination.items_per_page')}:
                    </span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="bg-[#080808] border border-[#262626] text-[#d4d4d4] text-sm font-semibold rounded-lg focus:ring-[#8b6a55] focus:border-[#8b6a55] block w-full p-2 outline-none transition-all duration-300"
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Center: Numeric Navigation */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-transparent text-[#737373] hover:bg-[#171717] hover:text-[#8b6a55] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title={t('pagination.first_page')}
                >
                    <ChevronsLeft size={18} />
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-[#262626] text-[#d4d4d4] hover:bg-[#171717] hover:border-[#8b6a55] hover:text-[#8b6a55] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 mx-1"
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline text-sm font-bold tracking-tight">
                        {t('pagination.previous')}
                    </span>
                </button>

                <div className="flex items-center gap-1">
                    {/* Simplified range showing only around current page */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-9 h-9 rounded-xl font-bold text-sm transition-all duration-300 ${
                                    currentPage === pageNum
                                        ? 'bg-[#171717] text-white ring-1 ring-[#8b6a55]'
                                        : 'text-[#d4d4d4] hover:bg-[#171717] hover:text-[#8b6a55]'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-[#262626] text-[#d4d4d4] hover:bg-[#171717] hover:border-[#8b6a55] hover:text-[#8b6a55] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 mx-1"
                >
                    <span className="hidden sm:inline text-sm font-bold tracking-tight">
                        {t('pagination.next')}
                    </span>
                    <ChevronRight size={16} />
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-transparent text-[#737373] hover:bg-[#171717] hover:text-[#8b6a55] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title={t('pagination.last_page')}
                >
                    <ChevronsRight size={18} />
                </button>
            </div>

            {/* Right: Quick Jump */}
            <form onSubmit={handleJumpToPage} className="flex items-center gap-2 w-full lg:w-auto justify-end">
                <span className="text-sm font-semibold text-[#a3a3a3] whitespace-nowrap">
                    {t('pagination.go_to')}:
                </span>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    className="w-16 p-2 bg-[#080808] border border-[#262626] rounded-lg text-center text-sm font-semibold text-[#d4d4d4] focus:ring-[#8b6a55] focus:border-[#8b6a55] outline-none transition-all"
                />
                <button
                    type="submit"
                    className="p-2 bg-[#171717] text-[#8b6a55] rounded-lg hover:bg-[#8b6a55] hover:text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300"
                >
                    OK
                </button>
            </form>
        </div>
    );
};

export default DetailedPagination;
