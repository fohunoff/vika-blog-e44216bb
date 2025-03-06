import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/services/api/mainApi';

const BlogHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { api } = useApi();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.main.getIndexCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [api.main]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-blog-white shadow-md py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="blog-container">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-display font-bold tracking-tight">
              МОЙ<span className="text-blog-yellow">БЛОГ</span>
            </h1>
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="text-blog-black hover:text-blog-yellow transition-colors"
              >
                {category.title}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 bg-blog-white z-40 p-5 flex flex-col gap-6 animate-fade-in">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="text-xl font-medium hover:text-blog-yellow"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default BlogHeader;
