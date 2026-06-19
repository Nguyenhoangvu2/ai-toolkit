'use client';

import { ReactNode } from 'react';

interface ToolLayoutProps {
  children: ReactNode;
}

export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50">
      {children}
    </div>
  );
}