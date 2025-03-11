
import userPreferences from '../../data/user/user-preferences.json';
import { getData, getById } from './utils';
import { UserPreference } from '../../types/user';

export function createUserApi() {
  return {
    /**
     * Get all user preferences
     */
    getUserPreferences: (): Promise<UserPreference[]> => {
      return getData(userPreferences as UserPreference[]);
    },
    
    /**
     * Get a single user preference by ID
     */
    getUserPreferenceById: (id: string): Promise<UserPreference | undefined> => {
      return getById(userPreferences as UserPreference[], id);
    },
    
    /**
     * Get user preferences by type
     */
    getUserPreferencesByType: (type: string): Promise<UserPreference[]> => {
      return getData(userPreferences as UserPreference[])
        .then(prefs => prefs.filter(pref => pref.type === type));
    }
  };
}
