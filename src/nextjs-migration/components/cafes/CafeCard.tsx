
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Cafe } from '@/types/cafe';

interface CafeCardProps {
  cafe: Cafe & { 
    categories?: string[],
    tags?: string[]
  };
}

const CafeCard = ({ cafe }: CafeCardProps) => {
  const {
    id,
    name,
    description,
    address,
    rating,
    priceRange,
    imageSrc,
    categories = [],
    tags = []
  } = cafe;

  // Функция для отображения рейтинга в виде звезд
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link href={`/cafes/${id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageSrc || '/placeholder.svg'}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          
          {priceRange && (
            <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-sm font-medium">
              {priceRange}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/cafes/${id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-blog-yellow transition-colors">{name}</h3>
        </Link>
        
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
        
        {address && (
          <div className="flex items-start mb-3 text-gray-600 text-sm">
            <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0" />
            <span>{address}</span>
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
          
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={`tag-${index}`} className="bg-blog-yellow-light text-blog-black">
              {tag}
            </Badge>
          ))}
          
          {tags.length > 3 && (
            <Badge variant="outline">+{tags.length - 3}</Badge>
          )}
        </div>
      </div>
    </article>
  );
};

export default CafeCard;
