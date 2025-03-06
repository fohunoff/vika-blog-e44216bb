
import { Link } from "react-router-dom";
import { ChefHat, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description?: string;
    shortDescription?: string;
    imageSrc: string;
    categoryName: string;
    time?: string;
    difficulty?: string;
  };
  index: number;
}

const RecipeCard = ({ recipe, index }: RecipeCardProps) => {
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <Link to={`/recipes/${recipe.id}`} className="block">
        <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={recipe.imageSrc} 
              alt={recipe.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-blog-yellow hover:bg-blog-yellow-dark text-blog-black">
                {recipe.categoryName}
              </Badge>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
            <p className="text-gray-600 mb-4">{recipe.description || recipe.shortDescription}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {recipe.time && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{recipe.time}</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-1">
                  <ChefHat size={16} />
                  <span>{recipe.difficulty}</span>
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

export default RecipeCard;
