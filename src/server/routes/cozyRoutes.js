
import express from 'express';
import * as cozyController from '../controllers/cozyController.js';

const router = express.Router();

// Cozy articles routes
router.get('/cozy/articles', cozyController.getAllArticles);
router.get('/cozy/highlights', cozyController.getHighlights);
router.get('/cozy/articles/:id', cozyController.getArticleById);

// Cozy categories route
router.get('/cozy/categories', cozyController.getCategories);

// Cozy highlight types route
router.get('/cozy/highlight-types', cozyController.getHighlightTypes);

// Cozy tags route
router.get('/cozy/tags', cozyController.getTags);

export default router;
