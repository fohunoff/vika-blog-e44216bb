import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DiaryEntry } from '@/types/diary';
import DOMPurify from 'dompurify';
import { formatDate, fetchAPI } from '@/nextjs-migration/lib/utils';
import { notFound } from 'next/navigation';
import DiaryTags from '@/nextjs-migration/components/diary/DiaryTags';
import RelatedEntries from '@/components/diary/RelatedEntries';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import EntryFooter from '@/components/diary/EntryFooter';
import EntryMeta from '@/components/diary/EntryMeta';

// Генерация метаданных для записи
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const entry = await getDiaryEntryById(params.id);
    
    if (!entry) {
      return {
        title: 'Запись не найдена | Дневник',
        description: 'К сожалению, запрашиваемая запись дневника не существует.',
      };
    }
    
    return {
      title: `${entry.title} | Дневник`,
      description: entry.shortDescription || `Запись дневника: ${entry.title}`,
      openGraph: {
        title: entry.title,
        description: entry.shortDescription || `Запись дневника: ${entry.title}`,
        images: entry.imageSrc ? [{ url: entry.imageSrc }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Дневник | Личные записи',
      description: 'Мой личный дневник. Мысли, впечатления и заметки о разных моментах жизни.',
    };
  }
}

// API функции для получения данных
async function getDiaryEntryById(id: string) {
  try {
    return await fetchAPI(`/diary/entries/${id}`);
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    return null;
  }
}

async function getDiaryCategories() {
  try {
    return await fetchAPI('/diary/categories');
  } catch (error) {
    console.error('Error fetching diary categories:', error);
    return [];
  }
}

async function getDiaryTags() {
  try {
    return await fetchAPI('/diary/tags');
  } catch (error) {
    console.error('Error fetching diary tags:', error);
    return [];
  }
}

async function getDiaryMoods() {
  try {
    return await fetchAPI('/diary/moods');
  } catch (error) {
    console.error('Error fetching diary moods:', error);
    return [];
  }
}

async function getEnrichedDiaryEntries() {
  try {
    return await fetchAPI('/diary/entries/enriched');
  } catch (error) {
    console.error('Error fetching enriched diary entries:', error);
    return [];
  }
}

// Компонент для отображения содержимого записи
const EntryContent = ({ content }: { content: string }) => {
  let sanitizedContent = "";
  
  // Проверяем, выполняемся ли мы на клиенте или сервере
  if (typeof window !== 'undefined') {
    // На клиенте используем DOMPurify
    sanitizedContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target'],
    });
  } else {
    // На сервере просто возвращаем контент
    sanitizedContent = content;
  }

  return (
    <div 
      className="diary-content ql-editor"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

// Основной компонент страницы
export default async function DiaryEntryPage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  // Получаем все необходимые данные с сервера
  const [entryData, categories, tags, moods, allEntries] = await Promise.all([
    getDiaryEntryById(id),
    getDiaryCategories(),
    getDiaryTags(),
    getDiaryMoods(),
    getEnrichedDiaryEntries()
  ]);
  
  // Если запись не найдена, возвращаем 404
  if (!entryData) {
    notFound();
  }
  
  // Нормализация массивов данных
  const tagIds = Array.isArray(entryData.tagIds) ? entryData.tagIds :
                (entryData.tagIds ? [entryData.tagIds] : []);
  
  const categoryIds = Array.isArray(entryData.categoryIds) ? entryData.categoryIds :
                    [entryData.categoryId || entryData.categoryIds].filter(Boolean);
  
  const moodIds = Array.isArray(entryData.moodIds) ? entryData.moodIds :
                 [entryData.moodId || entryData.moodIds].filter(Boolean);

  // Получение связанных метаданных
  const categoryData = categoryIds.map(categoryId => 
    categories.find((category: any) => category.id === categoryId)
  ).filter(Boolean);
  
  const tagsData = tagIds.map(tagId => 
    tags.find((tag: any) => tag.id === tagId)
  ).filter(Boolean);
  
  const moodData = moodIds.map(moodId => 
    moods.find((mood: any) => mood.id === moodId)
  ).filter(Boolean);

  // Обогащение записи метаданными
  const entry = {
    ...entryData,
    tags: tagsData.filter(Boolean).map((tag: any) => tag?.name),
    category: categoryData.filter(Boolean).find((category: any) => category)?.name,
    mood: moodData.filter(Boolean).find((mood: any) => mood)?.name,
    categoryIds,
    moodIds,
    tagIds
  };

  // Поиск связанных записей
  const relatedEntries = allEntries
    .filter((e: any) => e.id !== id) // Исключить текущую запись
    .filter((e: any) => {
      const sameCategory = e.category === entry.category;
      const hasMatchingTag = e.tags?.some((tag: string) => entry.tags?.includes(tag));
      return sameCategory || hasMatchingTag;
    })
    .slice(0, 3); // Ограничение до 3 связанных записей

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />

      <article className="blog-container py-8 md:py-16">
        <Link href="/diary" className="inline-flex items-center text-gray-500 hover:text-blog-yellow mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4"/> Назад к дневнику
        </Link>

        {entry.imageSrc && (
          <div className="relative h-[300px] md:h-[500px] w-full mb-8 rounded-xl overflow-hidden">
            <img
              src={entry.imageSrc}
              alt={entry.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <EntryMeta entry={entry} />

        <h1 className="text-3xl md:text-4xl font-bold mb-6">{entry.title}</h1>

        {entry.shortDescription && (
          <p className="text-xl text-gray-700 mb-8 font-serif italic">
            {entry.shortDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {entry.tags && entry.tags.length > 0 && (
            <DiaryTags tags={entry.tags} />
          )}
        </div>

        <div className="my-8">
          {entry.content && <EntryContent content={entry.content}/>}
        </div>

        <EntryFooter updatedAt={entry.updatedAt} />
      </article>

      {relatedEntries.length > 0 && (
        <RelatedEntries entries={relatedEntries} />
      )}

      <Footer />
    </main>
  );
}
