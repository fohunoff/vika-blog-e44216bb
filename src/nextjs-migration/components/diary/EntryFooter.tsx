
import React from 'react';
import { formatDate } from '@/nextjs-migration/lib/utils';

interface EntryFooterProps {
  updatedAt: string;
}

const EntryFooter = ({ updatedAt }: EntryFooterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6 text-sm">
      <div className="flex items-center">
        <span>Отредактировано: {formatDate(updatedAt)}</span>
      </div>
    </div>
  );
};

export default EntryFooter;
