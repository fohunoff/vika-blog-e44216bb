
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCategory } from "@/types/models";

interface RecipeFiltersProps {
  categories: RecipeCategory[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string) => void;
}

const RecipeFilters = ({ categories, activeCategory, onCategoryChange }: RecipeFiltersProps) => {
  return (
    <div className="bg-blog-black py-8">
      <div className="blog-container">
        <div className="flex items-center gap-2 mb-4 text-blog-white">
          <Filter size={20} />
          <h2 className="text-xl font-bold">Категории</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
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
      </div>
    </div>
  );
};

export default RecipeFilters;
