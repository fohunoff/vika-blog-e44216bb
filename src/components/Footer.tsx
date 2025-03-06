
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/services/api/mainApi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);
  const { api } = useApi();

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
    <footer className="bg-blog-black text-blog-white py-16">
      <div className="blog-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="block mb-4">
              <h3 className="text-2xl font-display font-bold tracking-tight">
                МОЙ<span className="text-blog-yellow">БЛОГ</span>
              </h3>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Личный блог о рецептах, впечатлениях, кафе и создании уютного пространства. Делюсь самым интересным и вдохновляющим.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blog-yellow transition-colors" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blog-yellow transition-colors" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blog-yellow transition-colors" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="mailto:example@blog.com" className="text-gray-400 hover:text-blog-yellow transition-colors" aria-label="Email">
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 uppercase">Категории</h4>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <Link to={category.link} className="text-gray-400 hover:text-blog-yellow transition-colors">
                    {category.navTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 uppercase">Ссылки</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blog-yellow transition-colors">
                  Обо мне
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blog-yellow transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-blog-yellow transition-colors">
                  Конфиденциальность
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} МОЙБЛОГ. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
