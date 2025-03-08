
import express from 'express';

// Import modular route handlers
import cafeRoutes from './cafe/cafeRoutes.js';
import categoryRoutes from './cafe/categoryRoutes.js';
import tagRoutes from './cafe/tagRoutes.js';
import priceRangeRoutes from './cafe/priceRangeRoutes.js';

const router = express.Router();

// Mount the modular routes
router.use('/', cafeRoutes);
router.use('/', categoryRoutes);
router.use('/', tagRoutes);
router.use('/', priceRangeRoutes);

/**
 * @swagger
 * components:
 *   schemas:
 *     Cafe:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - location
 *         - priceRange
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           description: The cafe ID
 *         name:
 *           type: string
 *           description: The cafe name
 *         description:
 *           type: string
 *           description: The cafe description
 *         shortDescription:
 *           type: string
 *           description: Short description of the cafe
 *         imageSrc:
 *           type: string
 *           description: URL of the image for the cafe
 *         location:
 *           type: string
 *           description: The cafe location
 *         openHours:
 *           type: string
 *           description: Opening hours
 *         priceRange:
 *           type: string
 *           description: Price range (e.g., $, $$, $$$)
 *         rating:
 *           type: number
 *           description: Rating from 1 to 5
 *         categoryIds:
 *           type: string
 *           description: JSON array of category IDs
 *         tagIds:
 *           type: string
 *           description: JSON array of tag IDs
 *         website:
 *           type: string
 *           description: The cafe website
 *         phone:
 *           type: string
 *           description: The cafe phone number
 *         address:
 *           type: string
 *           description: The cafe address
 *           
 *     CafeInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - location
 *         - priceRange
 *         - rating
 *       properties:
 *         name:
 *           type: string
 *           description: The cafe name
 *         description:
 *           type: string
 *           description: The cafe description
 *         shortDescription:
 *           type: string
 *           description: Short description of the cafe
 *         imageSrc:
 *           type: string
 *           description: URL of the image for the cafe
 *         location:
 *           type: string
 *           description: The cafe location
 *         openHours:
 *           type: string
 *           description: Opening hours
 *         priceRange:
 *           type: string
 *           description: Price range (e.g., $, $$, $$$)
 *         rating:
 *           type: number
 *           description: Rating from 1 to 5
 *         categoryIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of category IDs
 *         tagIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tag IDs
 *         website:
 *           type: string
 *           description: The cafe website
 *         phone:
 *           type: string
 *           description: The cafe phone number
 *         address:
 *           type: string
 *           description: The cafe address
 *           
 *     EnrichedCafe:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/Cafe'
 *         - type: object
 *           properties:
 *             categories:
 *               type: array
 *               items:
 *                 type: string
 *               description: Array of category names
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: Array of tag names
 *               
 *     CafeCategory:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The category ID
 *         name:
 *           type: string
 *           description: The category name
 *         image:
 *           type: string
 *           description: URL of the category image
 *           
 *     CafeTag:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The tag ID
 *         name:
 *           type: string
 *           description: The tag name
 *           
 *     CafePriceRange:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The price range ID
 *         name:
 *           type: string
 *           description: The price range name (e.g., $, $$, $$$)
 *         description:
 *           type: string
 *           description: Description of the price range
 */

export default router;
