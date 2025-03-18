
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';

export default function DiaryEntryNotFound() {
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      <div className="blog-container py-16 text-center">
        <h1 className="section-title mb-4">Запись не найдена</h1>
        <p className="mb-8">К сожалению, запрашиваемая запись дневника не существует.</p>
        <Link href="/diary">
          <div className="bg-blog-yellow text-blog-black hover:bg-blog-yellow/80 py-2 px-4 rounded flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к дневнику
          </div>
        </Link>
      </div>
      <Footer />
    </main>
  );
}
