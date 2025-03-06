
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CozyHighlightCard from './CozyHighlightCard.tsx';
import { CozyArticle } from '@/types/models';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

interface HighlightsSectionProps {
  highlights?: CozyArticle[];
}

const CozyHighlightsSection = ({ highlights: propHighlights }: HighlightsSectionProps) => {
  const { api } = useApi();
  const [highlights, setHighlights] = useState<CozyArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propHighlights && propHighlights.length > 0) {
      setHighlights(propHighlights);
      return;
    }

    const fetchHighlights = async () => {
      setIsLoading(true);
      try {
        const highlightsData = await api.cozy.getHighlights();
        setHighlights(highlightsData);
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, [api.cozy, propHighlights]);

  const displayHighlights = highlights.slice(0, 4);

  if (isLoading) {
    return <section className="mb-16"><p>Загрузка рекомендаций...</p></section>;
  }

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Рекомендуем</h2>
        <Link to="/cozy/highlights" className="text-blog-yellow hover:underline inline-flex items-center">
          Все материалы
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {displayHighlights.map((highlight) => (
          <CozyHighlightCard
            key={highlight.id}
            article={highlight}
          />
        ))}
      </div>
    </section>
  );
};

export default CozyHighlightsSection;
