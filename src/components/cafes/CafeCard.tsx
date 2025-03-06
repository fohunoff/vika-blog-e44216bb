
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Clock, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cafe } from '@/types/models';

interface CafeCardProps {
  cafe: Cafe & { 
    categories?: string[], 
    tags?: string[] 
  };
  index: number;
}

const CafeCard = ({ cafe, index }: CafeCardProps) => {
  // Function to render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-blog-yellow text-blog-yellow" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="text-gray-300" size={18} />
          <Star className="absolute top-0 left-0 fill-blog-yellow text-blog-yellow overflow-hidden w-[9px]" size={18} />
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <article 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={cafe.imageSrc}
          alt={cafe.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-blog-yellow text-blog-black px-3 py-1 rounded-full font-medium">
          {cafe.priceRange}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">{cafe.name}</h2>
          <div className="flex items-center gap-1">
            {renderStars(cafe.rating)}
            <span className="ml-1 text-gray-600 font-medium">{cafe.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4 gap-4">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{cafe.location}</span>
          </div>
          {cafe.openHours && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{cafe.openHours}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-6 line-clamp-3">{cafe.shortDescription || cafe.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {cafe.categories && cafe.categories.map(category => (
            <Badge 
              key={category}
              variant="secondary"
              className="bg-blog-yellow-light text-blog-black"
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <Link to={`/cafes/${cafe.id}`}>
          <Button 
            variant="outline"
            className="border-blog-yellow text-blog-black hover:bg-blog-yellow hover:text-blog-black"
          >
            <Coffee size={18} className="mr-2" />
            Подробнее
          </Button>
        </Link>
      </div>
    </article>
  );
};

export default CafeCard;
