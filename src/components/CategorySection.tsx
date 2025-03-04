
import { Link } from 'react-router-dom';

interface CategoryProps {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  bgColor: 'black' | 'white' | 'yellow';
}

const CategoryCard = ({ title, description, imageSrc, link, bgColor }: CategoryProps) => {
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
  const categories = [
    {
      title: 'Рецепты',
      description: 'Вкусные и простые рецепты для любого случая',
      imageSrc: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80&w=2574',
      link: '/recipes',
      bgColor: 'white' as const,
    },
    {
      title: 'Личный дневник',
      description: 'Мысли, впечатления и повседневные истории',
      imageSrc: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=2670',
      link: '/diary',
      bgColor: 'black' as const,
    },
    {
      title: 'Обзоры Кафе',
      description: 'Лучшие места города и их особенности',
      imageSrc: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=2671',
      link: '/cafes',
      bgColor: 'yellow' as const,
    },
    {
      title: 'Дом и уют',
      description: 'Идеи для создания комфортного пространства',
      imageSrc: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2658',
      link: '/home',
      bgColor: 'white' as const,
    },
  ];

  return (
    <section id="content" className="py-24 bg-blog-gray">
      <div className="blog-container">
        <h2 className="section-title mb-16 text-center">
          КАТЕГОРИИ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
