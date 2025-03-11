
import commentTypes from '../../data/comments/comment-types.json';
import { getData, getById } from './utils';
import { CommentType } from '../../types/comment';

export function createCommentsApi() {
  return {
    /**
     * Get all comment types
     */
    getCommentTypes: (): Promise<CommentType[]> => {
      return getData(commentTypes as CommentType[]);
    },
    
    /**
     * Get a single comment type by ID
     */
    getCommentTypeById: (id: string): Promise<CommentType | undefined> => {
      return getById(commentTypes as CommentType[], id);
    }
  };
}
