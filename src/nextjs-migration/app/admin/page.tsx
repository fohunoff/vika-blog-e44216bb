
import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDiaryEntries from '@/components/admin/diary/AdminDiaryEntries';
import AdminDiaryCategories from '@/components/admin/diary/AdminDiaryCategories';
import AdminDiaryTags from '@/components/admin/diary/AdminDiaryTags';
import AdminDiaryMoods from '@/components/admin/diary/AdminDiaryMoods';

export const metadata: Metadata = {
  title: 'Администрирование | Мой блог',
  description: 'Панель администрирования блога',
};

export default function AdminPage() {
  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Администрирование</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Вернуться к блогу
        </Link>
      </div>
      
      <Tabs defaultValue="diary" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="diary">Дневник</TabsTrigger>
          <TabsTrigger value="cozy">Уют</TabsTrigger>
          <TabsTrigger value="recipes">Рецепты</TabsTrigger>
          <TabsTrigger value="cafes">Кафе</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diary" className="space-y-6">
          <Tabs defaultValue="entries">
            <TabsList className="mb-4">
              <TabsTrigger value="entries">Записи</TabsTrigger>
              <TabsTrigger value="categories">Категории</TabsTrigger>
              <TabsTrigger value="tags">Теги</TabsTrigger>
              <TabsTrigger value="moods">Настроения</TabsTrigger>
            </TabsList>
            
            <TabsContent value="entries">
              <Suspense fallback={<div>Загрузка...</div>}>
                <AdminDiaryEntries />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="categories">
              <Suspense fallback={<div>Загрузка...</div>}>
                <AdminDiaryCategories />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="tags">
              <Suspense fallback={<div>Загрузка...</div>}>
                <AdminDiaryTags />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="moods">
              <Suspense fallback={<div>Загрузка...</div>}>
                <AdminDiaryMoods />
              </Suspense>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="cozy">
          <div className="p-12 text-center text-gray-500">
            Раздел администрирования для "Уют" в разработке
          </div>
        </TabsContent>
        
        <TabsContent value="recipes">
          <div className="p-12 text-center text-gray-500">
            Раздел администрирования для "Рецепты" в разработке
          </div>
        </TabsContent>
        
        <TabsContent value="cafes">
          <div className="p-12 text-center text-gray-500">
            Раздел администрирования для "Кафе" в разработке
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="p-12 text-center text-gray-500">
            Настройки сайта в разработке
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
