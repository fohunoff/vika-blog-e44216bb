
import Link from 'next/link';
import Image from 'next/image';
import { CozyArticle } from '@/types/cozy';

interface CozyArticlesSectionProps {
  articles: CozyArticle[];
}

const CozyArticlesSection = ({ articles }: CozyArticlesSectionProps) => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Все статьи</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
            <Link href={`/cozy/${article.id}`}>
              <div className="relative h-48">
                <Image
                  src={article.image || '/placeholder.svg'}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4">
                <span className="text-sm text-gray-500 mb-2 block">{article.date}</span>
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-gray-600 line-clamp-3">{article.content.substring(0, 100)}...</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CozyArticlesSection;
