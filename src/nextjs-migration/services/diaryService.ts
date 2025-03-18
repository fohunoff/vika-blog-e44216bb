
import { DiaryEntry } from '@/types/diary';

export async function getDiaryEntry(id: string): Promise<(DiaryEntry & {
  tags?: string[];
  category?: string;
  mood?: string;
}) | null> {
  try {
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    
    // Поддержка как числовых, так и строковых ID
    const entryId = id.startsWith('diary-entry-') ? id : `diary-entry-${id}`;
    
    console.log(`Fetching diary entry with ID: ${entryId}`);
    const response = await fetch(`${API_BASE_URL}/diary/entries/${entryId}`, { 
      next: { revalidate: 60 } 
    });
    
    if (response.status === 404) {
      console.log('Entry not found');
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entry: ${response.statusText}`);
    }
    
    const entryData = await response.json();
    console.log('Entry data fetched:', entryData ? 'success' : 'empty');
    
    // Fetch additional metadata
    const [categoriesResponse, tagsResponse, moodsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/diary/categories`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE_URL}/diary/tags`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE_URL}/diary/moods`, { next: { revalidate: 3600 } })
    ]);
    
    const categories = await categoriesResponse.json();
    const tags = await tagsResponse.json();
    const moods = await moodsResponse.json();
    
    // Normalize array data
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
    
    // Enhance entry with metadata
    const enrichedEntry = {
      ...entryData,
      tags: tagsData.filter(Boolean).map((tag: any) => tag?.name),
      category: categoryData.filter(Boolean).find((category: any) => category)?.name,
      mood: moodData.filter(Boolean).find((mood: any) => mood)?.name,
      categoryIds,
      moodIds,
      tagIds
    };
    
    return enrichedEntry;
  } catch (error) {
    console.error('Error fetching entry:', error);
    throw error;
  }
}

export async function getRelatedEntries(currentEntryId: string, 
  currentEntry: DiaryEntry & { category?: string; tags?: string[] }): Promise<(DiaryEntry & {
    tags?: string[];
    category?: string;
    mood?: string;
  })[]> {
  try {
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/diary/entries/enriched`, { next: { revalidate: 60 } });
    
    if (!response.ok) {
      throw new Error('Failed to fetch related entries');
    }
    
    const allEntries = await response.json();
    
    // Find related entries
    const relatedEntries = allEntries
      .filter((e: any) => e.id !== currentEntryId) // Exclude current entry
      .filter((e: any) => {
        const sameCategory = e.category === currentEntry.category;
        const hasMatchingTag = e.tags?.some((tag: string) => currentEntry.tags?.includes(tag));
        return sameCategory || hasMatchingTag;
      })
      .slice(0, 3); // Limit to 3 related entries
    
    return relatedEntries;
  } catch (error) {
    console.error('Error fetching related entries:', error);
    return [];
  }
}

export async function getAllDiaryEntries(): Promise<(DiaryEntry & {
  tags?: string[];
  category?: string;
  mood?: string;
})[]> {
  try {
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/diary/entries/enriched`, { 
      next: { revalidate: 60 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entries: ${response.statusText}`);
    }
    
    const entries = await response.json();
    return entries;
  } catch (error) {
    console.error('Error fetching all diary entries:', error);
    return [];
  }
}

export async function getDiaryMoods() {
  try {
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/diary/moods`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch moods: ${response.statusText}`);
    }
    
    const moods = await response.json();
    return moods;
  } catch (error) {
    console.error('Error fetching diary moods:', error);
    return [];
  }
}

export async function getDiaryCategories() {
  try {
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/diary/categories`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error fetching diary categories:', error);
    return [];
  }
}

export async function getDiaryTags() {
  try {
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/diary/tags`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }
    
    const tags = await response.json();
    return tags;
  } catch (error) {
    console.error('Error fetching diary tags:', error);
    return [];
  }
}
