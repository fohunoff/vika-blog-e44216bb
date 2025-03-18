
import { Utensils } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { Recipe } from '@/types/recipe';

interface RecipeListProps {
  recipes: (Recipe & { 
    categories?: string[], 
    tags?: string[] 
  })[];
}

const RecipeList = ({ recipes }: RecipeListProps) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <Utensils size={64} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-2xl font-bold mb-2">Рецепты не найдены</h3>
        <p className="text-gray-600">
          Попробуйте изменить параметры поиска или выбрать другую категорию.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;
