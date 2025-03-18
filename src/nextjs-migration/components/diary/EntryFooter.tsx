
import { Pencil } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatters';

interface EntryFooterProps {
  updatedAt: string;
}

const EntryFooter = ({ updatedAt }: EntryFooterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6 text-sm">
      <div className="flex items-center">
        <Pencil size={18} className="mr-2"/>
        <span>Отредактировано: {formatDate(updatedAt)}</span>
      </div>
    </div>
  );
};

export default EntryFooter;
