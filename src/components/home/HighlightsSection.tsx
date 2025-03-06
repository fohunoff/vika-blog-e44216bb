
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HomeHighlightCard from '../HomeHighlightCard';
import { HomeHighlight } from '@/types/models';

interface HighlightsSectionProps {
  highlights: HomeHighlight[];
}

const HighlightsSection = ({ highlights }: HighlightsSectionProps) => {
  // Display up to 4 highlights
  const displayHighlights = highlights.slice(0, 4);
  
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Рекомендуем</h2>
        <Link to="/home/highlights" className="text-blog-yellow hover:underline inline-flex items-center">
          Все материалы
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {displayHighlights.map((highlight) => (
          <HomeHighlightCard 
            key={highlight.id}
            highlight={highlight}
          />
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
