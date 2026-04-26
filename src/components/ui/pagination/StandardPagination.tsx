"use client";
import { Fragment } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { cn } from "@/utils/string";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const StandardPagination = ({
    currentPage,
    totalPages,
    onPageChange
}: PaginationProps) => {

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const delta = 1; // Number of pages to show around current page

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1
            ) {
                pages.push('...');
            }
        }

        // Filter out duplicate '...'
        return pages.filter((item, index) => pages.indexOf(item) === index);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-3 py-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-low border border-[#262626] text-on-surface-variant hover:border-[#8b6a55] hover:text-[#8b6a55] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 group"
            >
                <IoChevronBack className="text-xl group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-container-low/70 backdrop-blur-md border border-[#262626] rounded-xl">
                {generatePageNumbers().map((page, index) => (
                    <Fragment key={index}>
                        {page === '...' ? (
                            <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant/40 font-bold">
                                •••
                            </span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    "w-10 h-10 rounded-lg font-bold text-sm transition-all duration-300 scale-100 active:scale-95",
                                    currentPage === page
                                        ? "bg-[#171717] text-white border border-[#8b6a55]"
                                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-[#8b6a55]"
                                )}
                            >
                                {page}
                            </button>
                        )}
                    </Fragment>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-low border border-[#262626] text-on-surface-variant hover:border-[#8b6a55] hover:text-[#8b6a55] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 group"
            >
                <IoChevronForward className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default StandardPagination;
