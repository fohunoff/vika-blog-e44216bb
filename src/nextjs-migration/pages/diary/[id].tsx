
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DOMPurify from 'dompurify';
import { DiaryEntry } from '@/types/diary';
import { formatDate } from '@/utils/dateFormatters';
import { Badge } from '@/components/ui/badge';

// UI компоненты, адаптированные для Next.js
import EntryHeader from '@/components/diary/EntryHeader';
import EntryMeta from '@/components/diary/EntryMeta';
import EntryDescription from '@/components/diary/EntryDescription';
import EntryFooter from '@/components/diary/EntryFooter';
import RelatedEntries from '@/components/diary/RelatedEntries';
import DiaryTags from '@/components/diary/DiaryTags';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';

// Типы данных для SSR
interface DiaryEntryPageProps {
  entry: (DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  }) | null;
  relatedEntries: any[];
  error?: string;
}

// Компонент для отображения содержимого записи
const EntryContent = ({ content }: { content: string }) => {
  // Санитизация HTML для предотвращения XSS-атак с сохранением форматирования
  const sanitizedContent = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'], // Разрешаем атрибут target для ссылок
  });

  return (
    <div 
      className="diary-content ql-editor"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

// Основной компонент страницы
const DiaryEntryPage = ({ entry, relatedEntries, error }: DiaryEntryPageProps) => {
  if (error) {
    return (
      <main className="min-h-screen pt-24">
        <BlogHeader />
        <div className="blog-container py-16 text-center">
          <h1 className="section-title mb-4">Ошибка загрузки</h1>
          <p className="mb-8">{error}</p>
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

  if (!entry) {
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

  return (
    <>
      <Head>
        <title>{entry.title} | Дневник</title>
        <meta name="description" content={entry.shortDescription || `Запись дневника: ${entry.title}`} />
        <meta property="og:title" content={entry.title} />
        <meta property="og:description" content={entry.shortDescription || `Запись дневника: ${entry.title}`} />
        {entry.imageSrc && <meta property="og:image" content={entry.imageSrc} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

          <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
            <div className="flex items-center">
              <span>{formatDate(entry.createdAt)}</span>
            </div>

            {entry?.mood && (
              <div className="flex items-center">
                <span>{entry.mood}</span>
              </div>
            )}

            {entry?.category && (
              <div className="flex items-center">
                <span>{entry.category}</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{entry.title}</h1>

          {entry.shortDescription && (
            <p className="text-xl text-gray-700 mb-8 font-serif italic">
              {entry.shortDescription}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {entry.tags && entry.tags.length > 0 && entry.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blog-yellow-light text-blog-black"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="my-8">
            {entry.content && <EntryContent content={entry.content}/>}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6 text-sm">
            <div className="flex items-center">
              <span>Отредактировано: {formatDate(entry.updatedAt)}</span>
            </div>
          </div>
        </article>

        {relatedEntries.length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="blog-container">
              <h2 className="text-2xl font-bold mb-8">Похожие записи</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedEntries.map((relatedEntry) => (
                  <Link
                    key={relatedEntry.id}
                    href={`/diary/${relatedEntry.id}`}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{relatedEntry.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{formatDate(relatedEntry.createdAt)}</p>
                    <p className="line-clamp-3 text-gray-700">
                      {relatedEntry.shortDescription || relatedEntry.content.substring(0, 120)}...
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
};

// Функция для серверного рендеринга (SSR)
export const getServerSideProps: GetServerSideProps<DiaryEntryPageProps> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    // Получение данных на сервере
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    
    // Выполнение параллельных запросов для получения записи и связанных данных
    const [entryResponse, categoriesResponse, tagsResponse, moodsResponse, allEntriesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/diary/entries/${id}`),
      fetch(`${API_BASE_URL}/diary/categories`),
      fetch(`${API_BASE_URL}/diary/tags`),
      fetch(`${API_BASE_URL}/diary/moods`),
      fetch(`${API_BASE_URL}/diary/entries/enriched`)
    ]);

    // Если запись не найдена, возвращаем null
    if (entryResponse.status === 404) {
      return { props: { entry: null, relatedEntries: [] } };
    }
    
    // Обработка ответов
    const entryData = await entryResponse.json();
    const categories = await categoriesResponse.json();
    const tags = await tagsResponse.json();
    const moods = await moodsResponse.json();
    const allEntries = await allEntriesResponse.json();

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
    const enrichedEntry = {
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
        const sameCategory = e.category === enrichedEntry.category;
        const hasMatchingTag = e.tags?.some((tag: string) => enrichedEntry.tags?.includes(tag));
        return sameCategory || hasMatchingTag;
      })
      .slice(0, 3); // Ограничение до 3 связанных записей

    // Возвращаем данные для рендеринга
    return {
      props: {
        entry: enrichedEntry,
        relatedEntries,
      },
    };
  } catch (error) {
    console.error('Error fetching entry:', error);
    
    // Возвращаем ошибку для отображения на клиенте
    return {
      props: {
        entry: null,
        relatedEntries: [],
        error: 'Не удалось загрузить запись дневника. Пожалуйста, попробуйте позже.'
      },
    };
  }
};

export default DiaryEntryPage;
