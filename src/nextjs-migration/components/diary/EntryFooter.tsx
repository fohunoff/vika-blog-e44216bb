
import React from 'react';
import { ClockIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EntryFooterProps {
  updatedAt: string;
}

const EntryFooter = ({ updatedAt }: EntryFooterProps) => {
  if (!updatedAt) return null;
  
  return (
    <div className="border-t border-gray-100 pt-4 mt-8 text-gray-500 flex items-center gap-1">
      <ClockIcon className="h-4 w-4" />
      <span>Обновлено: {formatDate(updatedAt)}</span>
    </div>
  );
};

export default EntryFooter;
