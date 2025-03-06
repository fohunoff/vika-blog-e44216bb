import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import BlogHeader from '@/components/BlogHeader';
import BlogFooter from '@/components/BlogFooter';

const Cozy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { api } = useApi();

  return (
    <main className="min-h-screen">
      <BlogHeader />
      <section className="blog-container py-20">
        <h1 className="text-4xl font-bold mb-4">Дом и уют</h1>
        <p className="text-gray-700 leading-relaxed">
          Идеи для создания красивого и функционального интерьера, советы по уходу за растениями, лайфхаки по организации пространства и вдохновение для вашего дома.
        </p>
        <Link to="/" className="inline-block mt-6 text-blue-500 hover:underline">
          Вернуться на главную
        </Link>
      </section>
      <BlogFooter />
    </main>
  );
};

export default Cozy;
