
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Дневник',
  description: 'Мои личные записи, мысли и впечатления',
};

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      {children}
    </Suspense>
  );
}
