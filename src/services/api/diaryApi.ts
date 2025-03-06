
import diaryEntries from '../../data/diary.json';
import diaryCategories from '../../data/diary/diary-categories.json';
import diaryTags from '../../data/diary/diary-tags.json';
import diaryMoods from '../../data/diary/diary-moods.json';
import { 
  getData, 
  getById, 
  getByIds, 
  enrichWithRelated, 
  paginateData, 
  PaginationOptions, 
  PaginatedResponse 
} from './utils';
import { DiaryCategory, DiaryEntry, DiaryTag } from '../../types/models';

export function createDiaryApi() {
  return {
    /**
     * Get all diary entries
     */
    getDiaryEntries: (): Promise<DiaryEntry[]> => {
      return getData(diaryEntries as DiaryEntry[]);
    },
    
    /**
     * Get paginated diary entries
     */
    getPaginatedDiaryEntries: (options?: PaginationOptions): Promise<PaginatedResponse<DiaryEntry>> => {
      return getData(diaryEntries as DiaryEntry[]).then(entries => {
        return paginateData(entries, options);
      });
    },
    
    /**
     * Get a single diary entry by ID
     */
    getDiaryEntryById: (id: string): Promise<DiaryEntry | undefined> => {
      return getById(diaryEntries as DiaryEntry[], id);
    },
    
    /**
     * Get all diary categories
     */
    getCategories: (): Promise<DiaryCategory[]> => {
      return getData(diaryCategories as DiaryCategory[]);
    },
    
    /**
     * Get a single diary category by ID
     */
    getCategoryById: (id: string): Promise<DiaryCategory | undefined> => {
      return getById(diaryCategories as DiaryCategory[], id);
    },
    
    /**
     * Get all diary tags
     */
    getTags: (): Promise<DiaryTag[]> => {
      return getData(diaryTags as DiaryTag[]);
    },
    
    /**
     * Get a single diary tag by ID
     */
    getTagById: (id: string): Promise<DiaryTag | undefined> => {
      return getById(diaryTags as DiaryTag[], id);
    },
    
    /**
     * Get diary tags by IDs
     */
    getTagsByIds: (ids: string[]): Promise<DiaryTag[]> => {
      return getByIds(diaryTags as DiaryTag[], ids);
    },
    
    /**
     * Get diary moods
     */
    getMoods: () => {
      return getData(diaryMoods);
    },
    
    /**
     * Get a single diary mood by ID
     */
    getMoodById: (id: string) => {
      return getById(diaryMoods, id);
    },
    
    /**
     * Get enriched diary entries with category and tags information
     */
    getEnrichedDiaryEntries: async () => {
      const entries = await getData(diaryEntries as DiaryEntry[]);
      const categories = await getData(diaryCategories as DiaryCategory[]);
      const tags = await getData(diaryTags as DiaryTag[]);
      const moods = await getData(diaryMoods);
      
      return entries.map(entry => {
        const category = categories.find(c => c.id === entry.categoryId);
        const entryTags = entry.tagIds.map(id => tags.find(t => t.id === id)).filter(Boolean);
        const mood = moods.find(m => m.id === entry.moodId);
        
        return {
          ...entry,
          category: category?.name,
          tags: entryTags.map(t => t?.name),
          mood: mood?.name
        };
      });
    },
    
    /**
     * Get paginated enriched diary entries
     */
    getPaginatedEnrichedDiaryEntries: async (options?: PaginationOptions) => {
      const enrichedEntries = await this.getEnrichedDiaryEntries();
      return paginateData(enrichedEntries, options);
    }
  };
}
