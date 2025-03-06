
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCategory, RecipeDifficultyLevel } from "@/types/models";

interface RecipeFiltersProps {
  categories: RecipeCategory[];
  difficultyLevels: RecipeDifficultyLevel[];
  selectedCategory: string | null;
  selectedDifficulty: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedDifficulty: (difficulty: string | null) => void;
}

const RecipeFilters = ({ 
  categories, 
  difficultyLevels,
  selectedCategory, 
  selectedDifficulty,
  setSelectedCategory,
  setSelectedDifficulty 
}: RecipeFiltersProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="text-xl font-semibold">Категории</h2>
        </div>
        
        <div className="space-y-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setSelectedCategory(null)}
          >
            Все категории
          </Button>
          
          {categories && categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="text-xl font-semibold">Сложность</h2>
        </div>
        
        <div className="space-y-2">
          <Button
            variant={selectedDifficulty === null ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setSelectedDifficulty(null)}
          >
            Любая сложность
          </Button>
          
          {difficultyLevels && difficultyLevels.map((level) => (
            <Button
              key={level.id}
              variant={selectedDifficulty === level.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedDifficulty(level.id)}
            >
              {level.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeFilters;
