
import diaryTags from '../../../data/diary/diary-tags.json';
import { getData, getById, getByIds } from '../utils';
import { DiaryTag } from '../../../types/diary';
import { API_BASE_URL, apiFallback } from './diaryApiBase';

export function createDiaryTagsApi() {
  return {
    /**
     * Get all diary tags
     */
    getTags: async (): Promise<DiaryTag[]> => {
      return apiFallback(
        async () => {
          const response = await fetch(`${API_BASE_URL}/diary/tags`);
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
        },
        () => getData(diaryTags as DiaryTag[])
      );
    },

    /**
     * Get a single diary tag by ID
     */
    getTagById: async (id: string): Promise<DiaryTag | undefined> => {
      return apiFallback(
        async () => {
          const response = await fetch(`${API_BASE_URL}/diary/tags/${id}`);
          if (response.status === 404) return undefined;
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
        },
        () => getById(diaryTags as DiaryTag[], id)
      );
    },

    /**
     * Get diary tags by IDs
     */
    getTagsByIds: async (ids: string[]): Promise<DiaryTag[]> => {
      return apiFallback(
        async () => {
          const params = new URLSearchParams({ ids: ids.join(',') });
          const response = await fetch(`${API_BASE_URL}/diary/tags/multiple?${params}`);
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
        },
        () => getByIds(diaryTags as DiaryTag[], ids)
      );
    }
  };
}
