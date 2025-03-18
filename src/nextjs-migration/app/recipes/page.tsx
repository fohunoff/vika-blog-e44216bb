
import { Metadata } from 'next';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import RecipeSearch from '@/components/recipes/RecipeSearch';
import RecipeFilters from '@/components/recipes/RecipeFilters';
import RecipesList from '@/components/recipes/RecipesList';
import RecipeTags from '@/components/recipes/RecipeTags';

export const metadata: Metadata = {
  title: 'Рецепты | Мой блог',
  description: 'Коллекция вкусных и простых рецептов для всей семьи.',
};

export default function RecipesPage() {
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Рецепты</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <RecipeSearch />
            <RecipeFilters />
          </div>
          
          <div className="md:col-span-3">
            <RecipesList />
            <RecipeTags />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
