
import { createHomeApi } from './homeApi';
import { createRecipesApi } from './recipesApi';
import { createCafesApi } from './cafesApi';
import { createDiaryApi } from './diaryApi';
import { createUserApi } from './userApi';
import { createCommentsApi } from './commentsApi';

export const homeApi = createHomeApi();
export const recipesApi = createRecipesApi();
export const cafesApi = createCafesApi();
export const diaryApi = createDiaryApi();
export const userApi = createUserApi();
export const commentsApi = createCommentsApi();

export const api = {
  home: homeApi,
  recipes: recipesApi,
  cafes: cafesApi,
  diary: diaryApi,
  user: userApi,
  comments: commentsApi
};

export default api;
