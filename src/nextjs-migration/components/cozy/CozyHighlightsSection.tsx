
import Link from 'next/link';
import Image from 'next/image';
import { CozyArticle } from '@/types/cozy';

interface CozyHighlightsSectionProps {
  highlights: CozyArticle[];
}

const CozyHighlightsSection = ({ highlights }: CozyHighlightsSectionProps) => {
  // Only display up to 4 highlights
  const displayHighlights = highlights.slice(0, 4);
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Рекомендуемые материалы</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayHighlights.map((highlight) => (
          <div key={highlight.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
            <Link href={`/cozy/${highlight.id}`} className="block">
              <div className="relative h-48">
                <Image
                  src={highlight.image || '/placeholder.svg'}
                  alt={highlight.title}
                  fill
                  className="object-cover"
                />
                {highlight.type && (
                  <span className="absolute top-3 right-3 bg-blog-yellow text-blog-black px-3 py-1 rounded-full text-sm">
                    {highlight.type}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
                <p className="text-gray-600 line-clamp-3">{highlight.content.substring(0, 150)}...</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CozyHighlightsSection;
