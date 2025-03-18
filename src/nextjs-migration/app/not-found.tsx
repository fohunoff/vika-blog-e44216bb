
import Link from 'next/link';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <div className="blog-container py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Страница не найдена</h1>
        <p className="text-lg mb-8">Запрашиваемая страница не существует или была перемещена.</p>
        
        <Link 
          href="/" 
          className="bg-blog-yellow text-blog-black hover:bg-blog-yellow/80 py-2 px-4 rounded inline-flex items-center"
        >
          Вернуться на главную
        </Link>
      </div>
      
      <Footer />
    </main>
  );
}
