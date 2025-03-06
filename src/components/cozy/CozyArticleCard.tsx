
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge.tsx';
import { CozyArticle } from '@/types/models.ts';

interface CozyArticleCardProps {
  article: CozyArticle;
}

const CozyArticleCard = ({ article }: CozyArticleCardProps) => {
  const { id, title, content, image, date, category, tags } = article;

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link to={`/cozy/article/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-blog-yellow text-blog-black font-medium">
              {category}
            </Badge>
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock size={16} className="mr-2" />
          <time>{date}</time>
        </div>

        <Link to={`/cozy/article/${id}`} className="block mb-3">
          <h3 className="text-xl font-bold hover:text-blog-yellow transition-colors">{title}</h3>
        </Link>

        <p className="text-gray-600 mb-4 flex-grow">{content}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <Link key={index} to={`/cozy/tag/${tag}`}>
              <span className="text-sm text-gray-500 hover:text-blog-yellow transition-colors">
                #{tag}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};

export default CozyArticleCard;
