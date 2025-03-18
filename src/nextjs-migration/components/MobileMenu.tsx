
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleMenu}
        className="p-2 focus:outline-none"
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 pt-20">
          <div className="blog-container">
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 p-2 focus:outline-none"
              aria-label="Закрыть меню"
            >
              <X size={24} />
            </button>

            <nav className="flex flex-col space-y-6 text-xl">
              <Link 
                href="/" 
                onClick={toggleMenu}
                className="hover:text-blog-yellow transition-colors py-2"
              >
                Главная
              </Link>
              <Link 
                href="/recipes" 
                onClick={toggleMenu}
                className="hover:text-blog-yellow transition-colors py-2"
              >
                Рецепты
              </Link>
              <Link 
                href="/diary" 
                onClick={toggleMenu}
                className="hover:text-blog-yellow transition-colors py-2"
              >
                Дневник
              </Link>
              <Link 
                href="/cafes" 
                onClick={toggleMenu}
                className="hover:text-blog-yellow transition-colors py-2"
              >
                Кафе
              </Link>
              <Link 
                href="/cozy" 
                onClick={toggleMenu}
                className="hover:text-blog-yellow transition-colors py-2"
              >
                Уют
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
