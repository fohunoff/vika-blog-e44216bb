import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogHeader from '@/components/BlogHeader';
import BlogFooter from '@/components/BlogFooter';

const NotFound = () => {
  useEffect(() => {
    document.title = 'Страница не найдена';
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <BlogHeader />
      <main className="flex-grow grid place-items-center">
        <div className="text-center">
          <h1 className="font-semibold text-4xl tracking-tight text-blog-black">
            404
          </h1>
          <p className="mt-4 text-blog-gray">
            Страница не найдена
          </p>
          <Button asChild className="mt-6">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </Button>
        </div>
      </main>
      <BlogFooter />
    </div>
  );
};

export default NotFound;
