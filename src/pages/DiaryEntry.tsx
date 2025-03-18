
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';
import { DiaryEntry as DiaryEntryType } from '@/types/models';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {ArrowLeft, Calendar, Tag, MessageSquare, PencilLine, Pencil} from 'lucide-react';
import EntryContent from '@/components/diary/EntryContent';
import DiaryTags from '@/components/diary/DiaryTags';
import 'react-quill/dist/quill.snow.css';
import "@/styles/quill-viewer.css";

const DiaryEntryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { api } = useApi();
  const [entry, setEntry] = useState<DiaryEntryType & {
    category?: string;
    tags?: string[];
    mood?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedEntries, setRelatedEntries] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEntryData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const [entryData, allEntries] = await Promise.all([
          api.diary.getDiaryEntryById(id),
          api.diary.getEnrichedDiaryEntries()
        ]);

        if (!entryData) {
          toast({
            title: "Запись не найдена",
            description: "Запрашиваемая запись дневника не существует",
            variant: "destructive",
          });
          return;
        }

        // Ensure tagIds is an array
        const tagIds = Array.isArray(entryData.tagIds) ? entryData.tagIds :
                      (entryData.tagIds ? [entryData.tagIds] : []);

        // Ensure categoryIds is an array
        const categoryIds = Array.isArray(entryData.categoryIds) ? entryData.categoryIds :
                           [entryData.categoryId || entryData.categoryIds].filter(Boolean);

        // Ensure moodIds is an array
        const moodIds = Array.isArray(entryData.moodIds) ? entryData.moodIds :
                       [entryData.moodId || entryData.moodIds].filter(Boolean);

        // Fetch category, tags and mood details
        const [categoryData, tagsData, moodData] = await Promise.all([
          // Get all categories
          Promise.all(categoryIds.map((categoryId: string) => api.diary.getCategoryById(categoryId))),
          // Get all tags
          Promise.all(tagIds.map((tagId: string) => api.diary.getTagById(tagId))),
          // Get all moods
          Promise.all(moodIds.map((moodId: string) => api.diary.getMoodById(moodId))),
        ]);

        // Prepare enriched entry
        const enrichedEntry = {
          ...entryData,
          tags: tagsData.filter(Boolean).map(tag => tag?.name),
          category: categoryData.filter(Boolean).find(category => category)?.name,
          mood: moodData.filter(Boolean).find(mood => mood)?.name,
          categoryIds: categoryIds,
          moodIds: moodIds,
          tagIds: tagIds
        };

        setEntry(enrichedEntry);

        // Find related entries (same category or at least one matching tag)
        if (allEntries && allEntries.length) {
          const related = allEntries
            .filter(e => e.id !== id) // Exclude current entry
            .filter(e => {
              const sameCategory = e.category === enrichedEntry.category;
              const hasMatchingTag = e.tags?.some(tag => enrichedEntry.tags?.includes(tag));
              return sameCategory || hasMatchingTag;
            })
            .slice(0, 3); // Limit to 3 related entries

          setRelatedEntries(related);
        }

      } catch (error) {
        console.error("Error fetching entry:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить запись дневника. Пожалуйста, попробуйте позже.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntryData();
  }, [id, api.diary]);

  // Format date to Russian locale
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", { locale: ru });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24">
        <BlogHeader />
        <div className="blog-container py-16 text-center">
          <p>Загрузка записи...</p>
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
          <Link to="/diary">
            <Button className="bg-blog-yellow text-blog-black hover:bg-blog-yellow/80">
              <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к дневнику
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />

      <article className="blog-container py-8 md:py-16">
        <Link to="/diary"
              className="inline-flex items-center text-gray-500 hover:text-blog-yellow mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4"/> Назад к дневнику
        </Link>

        {entry?.imageSrc && (
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
            <Calendar size={18} className="mr-2"/>
            <span>{entry ? formatDate(entry.createdAt) : ''}</span>
          </div>

          {entry?.mood && (
              <div className="flex items-center">
                <MessageSquare size={18} className="mr-2"/>
                <span>{entry.mood}</span>
              </div>
          )}

          {entry?.category && (
              <div className="flex items-center">
                <Tag size={18} className="mr-2"/>
                <span>{entry.category}</span>
              </div>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-6">{entry?.title}</h1>

        {entry?.shortDescription && (
            <p className="text-xl text-gray-700 mb-8 font-serif italic">
              {entry.shortDescription}
            </p>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {entry?.tags && entry.tags.length > 0 && entry.tags.map((tag, index) => (
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
          {entry?.content && <EntryContent content={entry.content}/>}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6 text-sm">
          <div className="flex items-center">
            <Pencil size={18} className="mr-2"/>
            <span>Отредактировано: {entry ? formatDate(entry.updatedAt) : ''}</span>
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
                  to={`/diary/${relatedEntry.id}`}
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

      <DiaryTags
        tags={entry?.tags || []}
        onTagClick={() => {}}
      />

      <Footer />
    </main>
  );
};

export default DiaryEntryPage;
