
import { DiaryEntry } from '@/types/diary';
import Head from 'next/head';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import DiaryEntryView from './DiaryEntryView';
import ErrorDisplay from './ErrorDisplay';

interface DiaryEntryPageProps {
  entry: (DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  }) | null;
  relatedEntries: any[];
  error?: string;
}

const DiaryEntryPage = ({ entry, relatedEntries, error }: DiaryEntryPageProps) => {
  if (error) {
    return (
      <main className="min-h-screen pt-24">
        <BlogHeader />
        <ErrorDisplay 
          title="Ошибка загрузки" 
          message={error} 
        />
        <Footer />
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="min-h-screen pt-24">
        <BlogHeader />
        <ErrorDisplay 
          title="Запись не найдена" 
          message="К сожалению, запрашиваемая запись дневника не существует." 
        />
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
        <DiaryEntryView entry={entry} relatedEntries={relatedEntries} />
        <Footer />
      </main>
    </>
  );
};

export default DiaryEntryPage;
