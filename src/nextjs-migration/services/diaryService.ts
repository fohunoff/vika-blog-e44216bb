
import { fetchAPI } from "@/nextjs-migration/lib/utils";
import { DiaryEntry, DiaryCategory, DiaryTag, DiaryMood } from "@/types/diary";

// API functions for getting data
export async function getDiaryEntryById(id: string) {
  try {
    return await fetchAPI(`/diary/entries/${id}`);
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    return null;
  }
}

export async function getDiaryCategories() {
  try {
    return await fetchAPI('/diary/categories');
  } catch (error) {
    console.error('Error fetching diary categories:', error);
    return [];
  }
}

export async function getDiaryTags() {
  try {
    return await fetchAPI('/diary/tags');
  } catch (error) {
    console.error('Error fetching diary tags:', error);
    return [];
  }
}

export async function getDiaryMoods() {
  try {
    return await fetchAPI('/diary/moods');
  } catch (error) {
    console.error('Error fetching diary moods:', error);
    return [];
  }
}

export async function getEnrichedDiaryEntries() {
  try {
    return await fetchAPI('/diary/entries/enriched');
  } catch (error) {
    console.error('Error fetching enriched diary entries:', error);
    return [];
  }
}

// Helper function to enrich entry with metadata
export function enrichEntryWithMetadata(
  entryData: any, 
  categories: any[], 
  tags: any[], 
  moods: any[]
) {
  // Normalization of arrays
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

  // Return enriched entry
  return {
    ...entryData,
    tags: tagsData.filter(Boolean).map((tag: any) => tag?.name),
    category: categoryData.filter(Boolean).find((category: any) => category)?.name,
    mood: moodData.filter(Boolean).find((mood: any) => mood)?.name,
    categoryIds,
    moodIds,
    tagIds
  };
}

// Find related entries based on category or tags
export function findRelatedEntries(allEntries: any[], currentId: string, entry: any) {
  return allEntries
    .filter((e: any) => e.id !== currentId) // Exclude current entry
    .filter((e: any) => {
      const sameCategory = e.category === entry.category;
      const hasMatchingTag = e.tags?.some((tag: string) => entry.tags?.includes(tag));
      return sameCategory || hasMatchingTag;
    })
    .slice(0, 3); // Limit to 3 related entries
}
