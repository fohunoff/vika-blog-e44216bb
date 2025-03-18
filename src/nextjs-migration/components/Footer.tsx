
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blog-black text-white pt-12 pb-6">
      <div className="blog-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">О блоге</h3>
            <p className="text-gray-300">
              Блог о жизни, рецептах, интересных местах и создании уюта дома.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Разделы</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/recipes" className="text-gray-300 hover:text-blog-yellow transition-colors">
                  Рецепты
                </Link>
              </li>
              <li>
                <Link href="/diary" className="text-gray-300 hover:text-blog-yellow transition-colors">
                  Дневник
                </Link>
              </li>
              <li>
                <Link href="/cafes" className="text-gray-300 hover:text-blog-yellow transition-colors">
                  Кафе
                </Link>
              </li>
              <li>
                <Link href="/cozy" className="text-gray-300 hover:text-blog-yellow transition-colors">
                  Уют
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">
                Email: example@example.com
              </li>
              <li className="text-gray-300">
                Тел: +7 (XXX) XXX-XX-XX
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Подписки</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blog-yellow transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-blog-yellow transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-blog-yellow transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          &copy; {currentYear} Мой блог. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
