
import { Coffee } from 'lucide-react';
import CafeCard from './CafeCard';
import { Cafe } from '@/types/cafe';

interface CafesListProps {
  cafes: (Cafe & { 
    categories?: string[], 
    tags?: string[] 
  })[];
}

const CafesList = ({ cafes }: CafesListProps) => {
  if (cafes.length === 0) {
    return (
      <div className="text-center py-12">
        <Coffee size={64} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-2xl font-bold mb-2">Кафе не найдены</h3>
        <p className="text-gray-600">
          Попробуйте изменить параметры поиска или выбрать другую категорию.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {cafes.map((cafe) => (
        <CafeCard key={cafe.id} cafe={cafe} />
      ))}
    </div>
  );
};

export default CafesList;
