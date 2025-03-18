
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe & {
    categories?: string[];
    tags?: string[];
  };
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const {
    id,
    title,
    description,
    cookingTime,
    difficultyLevel,
    imageSrc,
    categories = [],
    tags = []
  } = recipe;

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link href={`/recipes/${id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageSrc || '/placeholder.svg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          
          {difficultyLevel && (
            <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-sm font-medium">
              {difficultyLevel}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/recipes/${id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-blog-yellow transition-colors">{title}</h3>
        </Link>
        
        {cookingTime && (
          <div className="flex items-center mb-3 text-gray-600 text-sm">
            <Clock size={16} className="mr-1" />
            <span>{cookingTime} мин</span>
          </div>
        )}
        
        {description && (
          <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {categories.map((category, index) => (
            <Badge key={`category-${index}`} variant="outline">
              {category}
            </Badge>
          ))}
          
          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={`tag-${index}`} className="bg-blog-yellow-light text-blog-black">
              {tag}
            </Badge>
          ))}
          
          {tags.length > 2 && (
            <Badge variant="outline">+{tags.length - 2}</Badge>
          )}
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
