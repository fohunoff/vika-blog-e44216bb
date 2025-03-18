
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  bgColor: 'black' | 'white' | 'yellow';
}

interface CategorySectionProps {
  categories: Category[];
}

// Компонент для отдельной карточки категории
const CategoryCard = ({ category }: { category: Category }) => {
  const { title, description, imageSrc, link, bgColor } = category;

  const bgColorClass = {
    black: 'bg-blog-black text-blog-white',
    white: 'bg-blog-white text-blog-black',
    yellow: 'bg-blog-yellow text-blog-black',
  }[bgColor];

  return (
    <div className={`category-card ${bgColorClass} group`}>
      <Link href={link} className="block h-full">
        <div className="relative h-60 overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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

const CategorySection = ({ categories }: CategorySectionProps) => {
  // Если категории не предоставлены, показываем заглушки
  const displayCategories = categories.length > 0 ? categories : [
    {
      id: 'recipes',
      title: 'Рецепты',
      description: 'Вкусные и простые рецепты для всей семьи',
      imageSrc: '/placeholder.svg',
      link: '/recipes',
      bgColor: 'white' as const
    },
    {
      id: 'diary',
      title: 'Дневник',
      description: 'Личные записи и размышления',
      imageSrc: '/placeholder.svg',
      link: '/diary',
      bgColor: 'black' as const
    },
    {
      id: 'cafes',
      title: 'Кафе',
      description: 'Обзоры кафе и ресторанов',
      imageSrc: '/placeholder.svg',
      link: '/cafes',
      bgColor: 'yellow' as const
    },
    {
      id: 'cozy',
      title: 'Уют',
      description: 'Идеи для создания уютного пространства',
      imageSrc: '/placeholder.svg',
      link: '/cozy',
      bgColor: 'white' as const
    }
  ];

  return (
    <section id="content" className="py-24 bg-blog-gray">
      <div className="blog-container">
        <h2 className="section-title mb-16 text-center">
          КАТЕГОРИИ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayCategories.map((category, index) => (
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
