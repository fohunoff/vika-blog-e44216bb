
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface PostProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc: string;
  link: string;
}

const PostCard = ({ title, excerpt, date, category, imageSrc, link }: PostProps) => {
  return (
    <article className="bg-blog-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <Link to={link} className="block">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blog-yellow px-3 py-1 text-sm font-medium rounded-full">
              {category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Clock size={16} className="mr-2" />
            <time>{date}</time>
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{excerpt}</p>
          <span className="inline-block font-medium text-blog-yellow">
            Читать полностью
          </span>
        </div>
      </Link>
    </article>
  );
};

const LatestPosts = () => {
  const posts = [
    {
      title: 'Тыквенный суп-пюре с имбирем',
      excerpt: 'Нежный, согревающий суп с ароматом осенних специй и ноткой имбиря.',
      date: '12 октября 2023',
      category: 'Рецепты',
      imageSrc: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&q=80&w=2574',
      link: '/recipes/pumpkin-soup',
    },
    {
      title: 'Kafe La Luna: уютное место для работы',
      excerpt: 'Обзор нового кафе в центре города с идеальными условиями для удаленной работы.',
      date: '5 октября 2023',
      category: 'Кафе',
      imageSrc: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=2678',
      link: '/cafes/la-luna',
    },
    {
      title: 'Осенние размышления у окна',
      excerpt: 'Мысли о переменах, новых начинаниях и планах на будущий год.',
      date: '29 сентября 2023',
      category: 'Дневник',
      imageSrc: 'https://images.unsplash.com/photo-1476782916354-326ab24c93df?auto=format&fit=crop&q=80&w=2729',
      link: '/diary/autumn-thoughts',
    },
  ];

  return (
    <section className="py-24 bg-blog-black text-blog-white">
      <div className="blog-container">
        <h2 className="section-title mb-16 text-center">
          ПОСЛЕДНИЕ <span className="text-blog-yellow">ЗАПИСИ</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link 
            to="/all-posts" 
            className="inline-block bg-blog-yellow text-blog-black px-8 py-4 rounded-full hover:bg-blog-yellow-dark transition-colors"
          >
            Все записи
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
