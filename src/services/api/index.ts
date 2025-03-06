
import {createMainApi} from "./mainApi.ts";

// Разделы
import { createCozyApi } from './cozyApi.ts';
import { createRecipesApi } from './recipesApi';
import { createCafesApi } from './cafesApi';
import { createDiaryApi } from './diaryApi';
import { createUserApi } from './userApi';
import { createCommentsApi } from './commentsApi';

export const mainApi = createMainApi();
export const cozyApi = createCozyApi();
export const recipesApi = createRecipesApi();
export const cafesApi = createCafesApi();
export const diaryApi = createDiaryApi();
export const userApi = createUserApi();
export const commentsApi = createCommentsApi();

export const api = {
  main: mainApi,
  cozy: cozyApi,
  recipes: recipesApi,
  cafes: cafesApi,
  diary: diaryApi,
  user: userApi,
  comments: commentsApi
};

export default api;
