"use client";

import React from "react";

interface FavoriteCardGridProps {
  children: React.ReactNode;
}

export function FavoriteCardGrid({ children }: FavoriteCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}
