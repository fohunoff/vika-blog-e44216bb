// Путь: src/server/routes/mainRoutes.js

// Проблема: в файле нет экспорта маршрутов
import express from 'express';
import {
    getMainCategories as getIndexCategories,
    getFeaturedSections,
    getFeaturedSectionById,
    getLatestPosts,
    getAboutData,
    getHeroData,
    getNewsletterData
} from '../controllers/mainController.js';

const router = express.Router();

/**
 * @swagger
 * /main/categories:
 *   get:
 *     summary: Get all navigation categories
 *     tags: [Main]
 *     responses:
 *       200:
 *         description: A list of navigation categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   navTitle:
 *                     type: string
 *                   description:
 *                     type: string
 *                   pageDescription:
 *                     type: string
 *                   imageSrc:
 *                     type: string
 *                   link:
 *                     type: string
 *                   bgColor:
 *                     type: string
 */
router.get('/main/categories', getIndexCategories);

/**
 * @swagger
 * /main/featured-sections:
 *   get:
 *     summary: Get all featured sections
 *     tags: [Main]
 *     responses:
 *       200:
 *         description: A list of featured sections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   type:
 *                     type: string
 */
router.get('/main/featured-sections', getFeaturedSections);

/**
 * @swagger
 * /main/featured-sections/{id}:
 *   get:
 *     summary: Get a featured section by ID
 *     tags: [Main]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Featured section ID
 *     responses:
 *       200:
 *         description: Featured section details
 *       404:
 *         description: Featured section not found
 */
router.get('/main/featured-sections/:id', getFeaturedSectionById);

/**
 * @swagger
 * /main/latest-posts:
 *   get:
 *     summary: Get latest posts
 *     tags: [Main]
 *     responses:
 *       200:
 *         description: A list of latest posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/main/latest-posts', getLatestPosts);

/**
 * @swagger
 * /main/about:
 *   get:
 *     summary: Get about section data
 *     tags: [Main]
 *     responses:
 *       200:
 *         description: About section data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/main/about', getAboutData);

/**
 * @swagger
 * /main/hero:
 *   get:
 *     summary: Get hero section data
 *     tags: [Main]
 *     responses:
 *       200:
 *         description: Hero section data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/main/hero', getHeroData);

/**
 * @swagger
 * /main/newsletter:
 *   get:
 *     summary: Get newsletter section data
 *     tags: [Main]
 *     responses:
 *       200:
 *         description: Newsletter section data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/main/newsletter', getNewsletterData);

// Добавляем экспорт роутера как дефолтный экспорт
export default router;
