
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi.ts';

interface Category {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  bgColor: 'black' | 'white' | 'yellow';
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { title, description, imageSrc, link, bgColor } = category;

  const bgColorClass = {
    black: 'bg-blog-black text-blog-white',
    white: 'bg-blog-white text-blog-black',
    yellow: 'bg-blog-yellow text-blog-black',
  }[bgColor];

  return (
    <div className={`category-card ${bgColorClass} group`}>
      <Link to={link} className="block h-full">
        <div className="relative h-60 overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="text-2xl uppercase font-bold tracking-tight mb-2">{title}</h3>
          <p className="mb-4">{description}</p>
          <span className="inline-block font-medium border-b-2 border-current pb-1">
            Смотреть
          </span>
        </div>
      </Link>
    </div>
  );
};

const CategorySection = () => {
  const { api } = useApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.main.getIndexCategories();
        // The data returned from api.cozy.getIndexCategories() is already in the format
        // that matches the Category interface, so we can safely set it
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [api.cozy]);

  if (isLoading) {
    return <section className="py-24 bg-blog-gray"><div className="blog-container">Загрузка категорий...</div></section>;
  }

  return (
    <section id="content" className="py-24 bg-blog-gray">
      <div className="blog-container">
        <h2 className="section-title mb-16 text-center">
          КАТЕГОРИИ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={category.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
