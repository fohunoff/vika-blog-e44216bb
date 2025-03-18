
import Link from 'next/link';
import { MobileMenu } from './MobileMenu';

const BlogHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="blog-container flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold font-display">
          МОЙ БЛОГ
        </Link>

        {/* Десктопное меню */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/recipes" className="hover:text-blog-yellow transition-colors">
            Рецепты
          </Link>
          <Link href="/diary" className="hover:text-blog-yellow transition-colors">
            Дневник
          </Link>
          <Link href="/cafes" className="hover:text-blog-yellow transition-colors">
            Кафе
          </Link>
          <Link href="/cozy" className="hover:text-blog-yellow transition-colors">
            Уют
          </Link>
        </nav>

        {/* Мобильное меню */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
