
import { fetchAPI } from "@/lib/utils";
import { DiaryEntry, DiaryCategory, DiaryTag, DiaryMood } from "@/types/diary";

/**
 * Fetch a single diary entry by ID
 */
export async function getDiaryEntryById(id: string): Promise<DiaryEntry | null> {
  return fetchAPI(`/diary/entries/${id}`);
}

/**
 * Fetch all categories
 */
export async function getDiaryCategories(): Promise<DiaryCategory[]> {
  return fetchAPI(`/diary/categories`);
}

/**
 * Fetch all tags
 */
export async function getDiaryTags(): Promise<DiaryTag[]> {
  return fetchAPI(`/diary/tags`);
}

/**
 * Fetch all moods
 */
export async function getDiaryMoods(): Promise<DiaryMood[]> {
  return fetchAPI(`/diary/moods`);
}

/**
 * Fetch enriched diary entries
 */
export async function getEnrichedDiaryEntries(): Promise<(DiaryEntry & {
  category?: string;
  tags?: string[];
  mood?: string;
})[]> {
  return fetchAPI(`/diary/entries/enriched`);
}
