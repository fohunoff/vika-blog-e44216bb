
import Link from 'next/link';
import { FileX } from 'lucide-react';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';

export default function DiaryEntryNotFound() {
  return (
    <MainLayout>
      <div className="blog-container py-16 text-center">
        <FileX size={64} className="mx-auto mb-6 text-gray-400" />
        <h1 className="text-3xl font-bold mb-4">Запись не найдена</h1>
        <p className="text-gray-600 mb-8">
          Извините, запрашиваемая запись дневника не существует или была удалена.
        </p>
        <Link 
          href="/diary"
          className="inline-block bg-blog-yellow text-blog-black px-6 py-3 rounded-full hover:bg-blog-yellow-dark transition-colors"
        >
          Вернуться к дневнику
        </Link>
      </div>
    </MainLayout>
  );
}
