'use client';

import { ReactNode } from 'react';
import { cn } from '@/utils/constants';
import { motion } from 'framer-motion';

interface OutputDisplayProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: string;
}

export function OutputDisplay({ children, className, title, icon }: OutputDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700',
        'bg-gray-50 dark:bg-gray-900/50',
        'p-4 md:p-6',
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
      )}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </motion.div>
  );
}