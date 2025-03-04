
import { useEffect } from 'react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';

const Diary = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      <div className="blog-container py-24">
        <h1 className="section-title mb-16 text-center">
          ЛИЧНЫЙ ДНЕВНИК
        </h1>
        <div className="text-center">
          <p className="text-xl mb-8">
            Раздел личного дневника находится в разработке. Скоро здесь появятся интересные записи!
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Diary;
