
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/utils/dateFormatters';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  link: string;
}

interface LatestPostsSectionProps {
  posts: Post[];
}

const LatestPostsSection = ({ posts }: LatestPostsSectionProps) => {
  // Если посты не предоставлены, показываем заглушки
  const displayPosts = posts.length > 0 ? posts : Array(3).fill(null).map((_, i) => ({
    id: `placeholder-${i}`,
    title: 'Название записи',
    excerpt: 'Краткое описание записи для предварительного просмотра...',
    date: new Date().toISOString(),
    image: '/placeholder.svg',
    category: 'Категория',
    link: '#'
  }));

  return (
    <section className="py-24 bg-blog-white">
      <div className="blog-container">
        <div className="flex justify-between items-center mb-16">
          <h2 className="section-title">
            ПОСЛЕДНИЕ<br/>ЗАПИСИ
          </h2>
          <Link href="/diary" className="hidden md:inline-block bg-blog-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Все записи
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <article 
              key={post.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <Link href={post.link} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
                  <span>{post.category}</span>
                  <span>{formatDate(post.date)}</span>
                </div>
                
                <Link href={post.link}>
                  <h3 className="text-xl font-bold mb-3 hover:text-blog-yellow transition-colors">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                
                <Link href={post.link} className="inline-block font-medium text-blog-yellow hover:underline">
                  Читать далее
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12 md:hidden">
          <Link href="/diary" className="inline-block bg-blog-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Все записи
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPostsSection;
