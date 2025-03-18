
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { DiaryEntry } from '@/types/diary';
import { useDiaryEntryData } from '@/hooks/useDiaryEntryData';
import MainLayout from '@/components/layout/MainLayout';
import EntryHeader from '@/components/diary/EntryHeader';
import EntryMeta from '@/components/diary/EntryMeta';
import EntryDescription from '@/components/diary/EntryDescription';
import EntryContent from '@/components/diary/EntryContent';
import EntryFooter from '@/components/diary/EntryFooter';
import RelatedEntries from '@/components/diary/RelatedEntries';
import EntryLoading from '@/components/diary/EntryLoading';
import EntryNotFound from '@/components/diary/EntryNotFound';

const DiaryEntryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { entry, relatedEntries, isLoading, error } = useDiaryEntryData(id || '');

  if (isLoading) {
    return (
      <MainLayout>
        <EntryLoading />
      </MainLayout>
    );
  }

  if (error || !entry) {
    return (
      <MainLayout>
        <EntryNotFound error={error} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="blog-container py-8 md:py-16">
        <EntryHeader 
          entryImage={entry.imageSrc} 
          title={entry.title} 
        />
        
        <EntryMeta 
          createdAt={entry.createdAt} 
          mood={entry.mood} 
          category={entry.category}
        />
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{entry.title}</h1>
        
        <EntryDescription description={entry.shortDescription} />

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {entry.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-blog-yellow-light text-blog-black px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="my-8">
          {entry.content && <EntryContent content={entry.content} />}
        </div>
        
        <EntryFooter updatedAt={entry.updatedAt} />
      </article>

      {relatedEntries.length > 0 && (
        <RelatedEntries entries={relatedEntries} />
      )}
    </MainLayout>
  );
};

export default DiaryEntryPage;
