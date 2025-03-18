
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';

export default function DiaryEntryNotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Запись не найдена</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Возможно, запись была удалена или вы перешли по неверной ссылке.
        </p>
        <Link href="/diary">
          <Button>Вернуться к списку записей</Button>
        </Link>
      </div>
    </MainLayout>
  );
}
