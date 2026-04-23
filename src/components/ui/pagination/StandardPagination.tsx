"use client";
import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { cn } from "@/utils/string";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const StandardPagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {

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
        <div className="flex items-center justify-center gap-4 py-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-container-low border-2 border-outline-variant/10 text-on-surface-variant hover:border-azure/30 hover:text-azure disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-90 group"
            >
                <IoChevronBack className="text-xl group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-container-low/40 backdrop-blur-md border-2 border-outline-variant/5 rounded-[24px]">
                {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant/40 font-black">
                                •••
                            </span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    "w-10 h-10 rounded-xl font-black text-sm transition-all duration-500 scale-100 active:scale-90",
                                    currentPage === page
                                        ? "bg-azure text-white shadow-lg shadow-azure/30"
                                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-azure"
                                )}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-container-low border-2 border-outline-variant/10 text-on-surface-variant hover:border-azure/30 hover:text-azure disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-90 group"
            >
                <IoChevronForward className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default StandardPagination;
