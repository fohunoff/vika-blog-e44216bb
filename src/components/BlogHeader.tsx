
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const BlogHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <Link 
              to="/recipes" 
              className="text-blog-black hover:text-blog-yellow transition-colors"
            >
              Рецепты
            </Link>
            <Link 
              to="/diary" 
              className="text-blog-black hover:text-blog-yellow transition-colors"
            >
              Дневник
            </Link>
            <Link 
              to="/cafes" 
              className="text-blog-black hover:text-blog-yellow transition-colors"
            >
              Кафе
            </Link>
            <Link 
              to="/home" 
              className="text-blog-black hover:text-blog-yellow transition-colors"
            >
              Дом и уют
            </Link>
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
            <Link 
              to="/recipes" 
              className="text-xl font-medium hover:text-blog-yellow"
              onClick={() => setMobileMenuOpen(false)}
            >
              Рецепты
            </Link>
            <Link 
              to="/diary" 
              className="text-xl font-medium hover:text-blog-yellow"
              onClick={() => setMobileMenuOpen(false)}
            >
              Дневник
            </Link>
            <Link 
              to="/cafes" 
              className="text-xl font-medium hover:text-blog-yellow"
              onClick={() => setMobileMenuOpen(false)}
            >
              Кафе
            </Link>
            <Link 
              to="/home" 
              className="text-xl font-medium hover:text-blog-yellow"
              onClick={() => setMobileMenuOpen(false)}
            >
              Дом и уют
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default BlogHeader;
