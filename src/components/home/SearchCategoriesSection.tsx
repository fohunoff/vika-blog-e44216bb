
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeCategory } from '@/types/models';

interface SearchCategoriesSectionProps {
  categories: HomeCategory[];
}

const SearchCategoriesSection = ({ categories }: SearchCategoriesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-10">
        <div className="relative w-full md:w-2/3">
          <input
            type="text"
            placeholder="Поиск статей, идей и советов..."
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blog-yellow/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        
        <button className="w-full md:w-1/3 bg-blog-yellow hover:bg-blog-yellow/90 text-white py-3 px-6 rounded-lg transition-colors">
          Искать
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Link 
            key={category.id}
            to={`/home/category/${category.id}`}
            className="bg-white hover:bg-blog-yellow hover:text-white rounded-lg py-3 text-center transition-colors shadow-sm"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SearchCategoriesSection;
