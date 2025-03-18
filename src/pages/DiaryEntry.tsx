
import { useParams } from 'react-router-dom';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import EntryContent from '@/components/diary/EntryContent';
import DiaryTags from '@/components/diary/DiaryTags';
import EntryMeta from '@/components/diary/EntryMeta';
import RelatedEntries from '@/components/diary/RelatedEntries';
import EntryHeader from '@/components/diary/EntryHeader';
import EntryDescription from '@/components/diary/EntryDescription';
import EntryFooter from '@/components/diary/EntryFooter';
import EntryLoading from '@/components/diary/EntryLoading';
import EntryNotFound from '@/components/diary/EntryNotFound';
import { useDiaryEntryData } from '@/hooks/useDiaryEntryData';
import 'react-quill/dist/quill.snow.css';
import "@/styles/quill-viewer.css";

const DiaryEntryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { entry, isLoading, relatedEntries } = useDiaryEntryData(id);

  if (isLoading) {
    return <EntryLoading />;
  }

  if (!entry) {
    return <EntryNotFound />;
  }

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />

      <article className="blog-container py-8 md:py-16">
        <EntryHeader 
          entryImage={entry.imageSrc} 
          title={entry.title} 
        />

        <EntryMeta entry={entry} />

        <EntryDescription
          title={entry.title}
          shortDescription={entry.shortDescription}
          tags={entry.tags}
        />

        <div className="my-8">
          {entry.content && <EntryContent content={entry.content}/>}
        </div>

        <EntryFooter updatedAt={entry.updatedAt} />
      </article>

      <RelatedEntries entries={relatedEntries} />

      <DiaryTags
        tags={entry?.tags || []}
        onTagClick={() => {}}
      />

      <Footer />
    </main>
  );
};

export default DiaryEntryPage;
