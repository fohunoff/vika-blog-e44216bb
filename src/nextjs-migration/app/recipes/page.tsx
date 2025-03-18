
import { Metadata } from 'next';
import { fetchAPI } from '@/nextjs-migration/lib/api';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import RecipeList from '@/nextjs-migration/components/recipes/RecipeList';
import RecipeSearch from '@/nextjs-migration/components/recipes/RecipeSearch';
import RecipeSidebar from '@/nextjs-migration/components/recipes/RecipeSidebar';

export const metadata: Metadata = {
  title: 'Рецепты | Мой блог',
  description: 'Коллекция вкусных и простых рецептов для всей семьи.',
};

// Функции для получения данных
async function getRecipes() {
  return fetchAPI('/recipes');
}

async function getRecipeCategories() {
  return fetchAPI('/recipes/categories');
}

async function getRecipeTags() {
  return fetchAPI('/recipes/tags');
}

async function getRecipeDifficultyLevels() {
  return fetchAPI('/recipes/difficulty-levels');
}

export default async function RecipesPage() {
  // Получаем данные с сервера
  const [recipes, categories, tags, difficultyLevels] = await Promise.all([
    getRecipes().catch(() => []),
    getRecipeCategories().catch(() => []),
    getRecipeTags().catch(() => []),
    getRecipeDifficultyLevels().catch(() => [])
  ]);
  
  return (
    <MainLayout>
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Рецепты</h1>
        
        <RecipeSearch />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <RecipeSidebar 
              categories={categories} 
              difficultyLevels={difficultyLevels} 
            />
          </div>
          
          <div className="md:col-span-3">
            <RecipeList recipes={recipes} />
            
            {tags && tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Популярные теги</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <span 
                      key={tag.id}
                      className="bg-blog-yellow-light text-blog-black px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blog-yellow"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
