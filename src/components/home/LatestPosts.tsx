
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc: string;
  link: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { title, excerpt, date, category, imageSrc, link } = post;
  
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
  const { api } = useApi();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.home.getLatestPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [api.home]);

  if (isLoading) {
    return <section className="py-24 bg-blog-black text-blog-white"><div className="blog-container">Загрузка последних записей...</div></section>;
  }

  return (
    <section className="py-24 bg-blog-black text-blog-white">
      <div className="blog-container">
        <h2 className="section-title mb-16 text-center">
          ПОСЛЕДНИЕ <span className="text-blog-yellow">ЗАПИСИ</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <PostCard post={post} />
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
