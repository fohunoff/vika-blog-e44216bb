
import HomeHighlightCard from '../HomeHighlightCard';

interface HighlightItem {
  id: number;
  title: string;
  content: string;
  image: string;
  type: string;
}

interface HighlightsSectionProps {
  highlights: HighlightItem[];
}

const HighlightsSection = ({ highlights }: HighlightsSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      {highlights.map((highlight) => (
        <HomeHighlightCard key={highlight.id} {...highlight} />
      ))}
    </div>
  );
};

export default HighlightsSection;
