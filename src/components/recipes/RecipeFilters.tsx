
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCategory, RecipeDifficultyLevel } from "@/types/models";

interface RecipeFiltersProps {
  categories: RecipeCategory[];
  difficultyLevels?: RecipeDifficultyLevel[];
  activeCategory: string | null;
  activeDifficulty?: string | null;
  onCategoryChange: (categoryId: string) => void;
  onDifficultyChange?: (difficultyId: string) => void;
}

const RecipeFilters = ({ 
  categories, 
  difficultyLevels, 
  activeCategory, 
  activeDifficulty, 
  onCategoryChange,
  onDifficultyChange 
}: RecipeFiltersProps) => {
  return (
    <div className="bg-blog-black py-8">
      <div className="blog-container">
        <div className="flex items-center gap-2 mb-4 text-blog-white">
          <Filter size={20} />
          <h2 className="text-xl font-bold">Категории</h2>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`rounded-full ${
                activeCategory === category.id 
                  ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                  : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {difficultyLevels && difficultyLevels.length > 0 && onDifficultyChange && (
          <>
            <div className="flex items-center gap-2 mb-4 text-blog-white mt-6">
              <Filter size={20} />
              <h2 className="text-xl font-bold">Сложность</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {difficultyLevels.map((level) => (
                <Button
                  key={level.id}
                  variant={activeDifficulty === level.id ? "default" : "outline"}
                  className={`rounded-full ${
                    activeDifficulty === level.id 
                      ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                      : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
                  }`}
                  onClick={() => onDifficultyChange(level.id)}
                >
                  {level.name}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeFilters;
