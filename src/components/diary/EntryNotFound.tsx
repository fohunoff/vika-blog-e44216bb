
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogHeader from '../BlogHeader';
import Footer from '../Footer';

const EntryNotFound = () => {
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      <div className="blog-container py-16 text-center">
        <h1 className="section-title mb-4">Запись не найдена</h1>
        <p className="mb-8">К сожалению, запрашиваемая запись дневника не существует.</p>
        <Link to="/diary">
          <Button className="bg-blog-yellow text-blog-black hover:bg-blog-yellow/80">
            <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к дневнику
          </Button>
        </Link>
      </div>
      <Footer />
    </main>
  );
};

export default EntryNotFound;
