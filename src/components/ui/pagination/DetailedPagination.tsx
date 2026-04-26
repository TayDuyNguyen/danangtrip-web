"use client";
import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "@/components/icons/solar";

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
    const pageSizeSelectId = useId().replace(/:/g, '');
    const jumpInputId = useId().replace(/:/g, '');
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
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-6 border-t border-border mt-4">
            {/* Left: Summary and Page Size */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                <p className="text-sm font-semibold text-on-surface-subtle whitespace-nowrap">
                    {t('pagination.showing')} <span className="text-primary">{startItem}</span> {t('pagination.to')} <span className="text-primary">{endItem}</span> {t('pagination.of')} <span className="text-on-surface">{totalItems}</span> {t('pagination.results')}
                </p>

                <div className="flex items-center gap-3">
                    <label htmlFor={pageSizeSelectId} className="text-sm font-semibold text-on-surface-subtle whitespace-nowrap">
                        {t('pagination.items_per_page')}:
                    </label>
                    <select
                        id={pageSizeSelectId}
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="bg-surface border border-border text-on-surface-subtle text-sm font-semibold rounded-lg focus:ring-primary focus:border-primary block w-full p-2 outline-none transition-all duration-300"
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
                    className="p-2 rounded-lg border border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title={t('pagination.first_page')}
                >
                    <ChevronsLeft size={18} />
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border text-on-surface-subtle hover:bg-surface-container-high hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 mx-1"
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
                                className={`w-9 h-9 rounded-lg font-bold text-sm transition-all duration-300 ${
                                    currentPage === pageNum
                                        ? 'bg-surface-container-high text-on-surface ring-1 ring-primary'
                                        : 'text-on-surface-subtle hover:bg-surface-container-high hover:text-primary'
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
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border text-on-surface-subtle hover:bg-surface-container-high hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 mx-1"
                >
                    <span className="hidden sm:inline text-sm font-bold tracking-tight">
                        {t('pagination.next')}
                    </span>
                    <ChevronRight size={16} />
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title={t('pagination.last_page')}
                >
                    <ChevronsRight size={18} />
                </button>
            </div>

            {/* Right: Quick Jump */}
            <form onSubmit={handleJumpToPage} className="flex items-center gap-2 w-full lg:w-auto justify-end">
                <label htmlFor={jumpInputId} className="text-sm font-semibold text-on-surface-subtle whitespace-nowrap">
                    {t('pagination.go_to')}:
                </label>
                <input
                    id={jumpInputId}
                    type="number"
                    min="1"
                    max={totalPages}
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    className="w-16 p-2 bg-surface border border-border rounded-lg text-center text-sm font-semibold text-on-surface-subtle focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <button
                    type="submit"
                    className="p-2 bg-surface-container-high text-primary rounded-lg hover:bg-primary hover:text-on-primary font-semibold text-xs uppercase tracking-wider transition-all duration-300"
                >
                    OK
                </button>
            </form>
        </div>
    );
};

export default DetailedPagination;
