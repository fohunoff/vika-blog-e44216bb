
import { GetServerSideProps } from 'next';
import { DiaryEntry } from '@/types/diary';
import DiaryEntryPage from '@/nextjs-migration/components/diary/DiaryEntryPage';

// Types for SSR
interface DiaryEntryPageProps {
  entry: (DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  }) | null;
  relatedEntries: any[];
  error?: string;
}

// Main page component
const DiaryPage = (props: DiaryEntryPageProps) => {
  return <DiaryEntryPage {...props} />;
};

// Function for server-side rendering (SSR)
export const getServerSideProps: GetServerSideProps<DiaryEntryPageProps> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    // Get data on the server
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    
    // Execute parallel requests to get entry and related data
    const [entryResponse, categoriesResponse, tagsResponse, moodsResponse, allEntriesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/diary/entries/${id}`),
      fetch(`${API_BASE_URL}/diary/categories`),
      fetch(`${API_BASE_URL}/diary/tags`),
      fetch(`${API_BASE_URL}/diary/moods`),
      fetch(`${API_BASE_URL}/diary/entries/enriched`)
    ]);

    // If entry not found, return null
    if (entryResponse.status === 404) {
      return { props: { entry: null, relatedEntries: [] } };
    }
    
    // Process responses
    const entryData = await entryResponse.json();
    const categories = await categoriesResponse.json();
    const tags = await tagsResponse.json();
    const moods = await moodsResponse.json();
    const allEntries = await allEntriesResponse.json();

    // Normalize data arrays
    const tagIds = Array.isArray(entryData.tagIds) ? entryData.tagIds :
                  (entryData.tagIds ? [entryData.tagIds] : []);
    
    const categoryIds = Array.isArray(entryData.categoryIds) ? entryData.categoryIds :
                      [entryData.categoryId || entryData.categoryIds].filter(Boolean);
    
    const moodIds = Array.isArray(entryData.moodIds) ? entryData.moodIds :
                   [entryData.moodId || entryData.moodIds].filter(Boolean);

    // Get related metadata
    const categoryData = categoryIds.map(categoryId => 
      categories.find((category: any) => category.id === categoryId)
    ).filter(Boolean);
    
    const tagsData = tagIds.map(tagId => 
      tags.find((tag: any) => tag.id === tagId)
    ).filter(Boolean);
    
    const moodData = moodIds.map(moodId => 
      moods.find((mood: any) => mood.id === moodId)
    ).filter(Boolean);

    // Enrich entry with metadata
    const enrichedEntry = {
      ...entryData,
      tags: tagsData.filter(Boolean).map((tag: any) => tag?.name),
      category: categoryData.filter(Boolean).find((category: any) => category)?.name,
      mood: moodData.filter(Boolean).find((mood: any) => mood)?.name,
      categoryIds,
      moodIds,
      tagIds
    };

    // Find related entries
    const relatedEntries = allEntries
      .filter((e: any) => e.id !== id) // Exclude current entry
      .filter((e: any) => {
        const sameCategory = e.category === enrichedEntry.category;
        const hasMatchingTag = e.tags?.some((tag: string) => enrichedEntry.tags?.includes(tag));
        return sameCategory || hasMatchingTag;
      })
      .slice(0, 3); // Limit to 3 related entries

    // Return data for rendering
    return {
      props: {
        entry: enrichedEntry,
        relatedEntries,
      },
    };
  } catch (error) {
    console.error('Error fetching entry:', error);
    
    // Return error for display on client
    return {
      props: {
        entry: null,
        relatedEntries: [],
        error: 'Не удалось загрузить запись дневника. Пожалуйста, попробуйте позже.'
      },
    };
  }
};

export default DiaryPage;
