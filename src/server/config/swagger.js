import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the application',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Recipes',
        description: 'Recipe management endpoints'
      },
      {
        name: 'Cafes',
        description: 'Cafe management endpoints'
      },
      {
        name: 'Cozy Articles',
        description: 'Cozy articles management endpoints'
      },
      {
        name: 'Diary',
        description: 'Diary entries management endpoints'
      }
    ],
    components: {
      schemas: {
        Recipe: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            shortDescription: { type: 'string' },
            imageSrc: { type: 'string' },
            categoryId: { type: 'string' },
            prepTime: { type: 'string' },
            cookTime: { type: 'string' },
            servings: { type: 'integer' },
            difficulty: { type: 'string' },
            ingredients: {
              type: 'array',
              items: { type: 'string' }
            },
            instructions: {
              type: 'array',
              items: { type: 'string' }
            },
            tagIds: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        RecipeCategory: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' }
          }
        },
        RecipeTag: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' }
          }
        },
        CozyArticle: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            imageSrc: { type: 'string' },
            isHighlight: { type: 'boolean' },
            typeId: { type: 'string' },
            categoryIds: {
              type: 'array',
              items: { type: 'string' }
            },
            tagIds: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        DiaryEntry: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            mood: { type: 'string' },
            categoryId: { type: 'string' },
            tagIds: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        Cafe: {
          type: 'object',
          required: [
            'id',
            'name',
            'description',
            'location',
            'priceRange',
            'rating'
          ],
          properties: {
            id: {
              type: 'string',
              description: 'The cafe ID'
            },
            name: {
              type: 'string',
              description: 'The cafe name'
            },
            description: {
              type: 'string',
              description: 'The cafe description'
            },
            shortDescription: {
              type: 'string',
              description: 'Short description of the cafe'
            },
            imageSrc: {
              type: 'string',
              description: 'URL of the image for the cafe'
            },
            location: {
              type: 'string',
              description: 'The cafe location'
            },
            openHours: {
              type: 'string',
              description: 'Opening hours'
            },
            priceRange: {
              type: 'string',
              description: 'Price range (e.g., $, $$, $$$)'
            },
            rating: {
              type: 'number',
              description: 'Rating from 1 to 5'
            },
            categoryIds: {
              type: 'string',
              description: 'JSON array of category IDs'
            },
            tagIds: {
              type: 'string',
              description: 'JSON array of tag IDs'
            },
            website: {
              type: 'string',
              description: 'The cafe website'
            },
            phone: {
              type: 'string',
              description: 'The cafe phone number'
            },
            address: {
              type: 'string',
              description: 'The cafe address'
            }
          }
        },
        CafeInput: {
          type: 'object',
          required: [
            'name',
            'description',
            'location',
            'priceRange',
            'rating'
          ],
          properties: {
            name: {
              type: 'string',
              description: 'The cafe name'
            },
            description: {
              type: 'string',
              description: 'The cafe description'
            },
            shortDescription: {
              type: 'string',
              description: 'Short description of the cafe'
            },
            imageSrc: {
              type: 'string',
              description: 'URL of the image for the cafe'
            },
            location: {
              type: 'string',
              description: 'The cafe location'
            },
            openHours: {
              type: 'string',
              description: 'Opening hours'
            },
            priceRange: {
              type: 'string',
              description: 'Price range (e.g., $, $$, $$$)'
            },
            rating: {
              type: 'number',
              description: 'Rating from 1 to 5'
            },
            categoryIds: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of category IDs'
            },
            tagIds: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of tag IDs'
            },
            website: {
              type: 'string',
              description: 'The cafe website'
            },
            phone: {
              type: 'string',
              description: 'The cafe phone number'
            },
            address: {
              type: 'string',
              description: 'The cafe address'
            }
          }
        },
        EnrichedCafe: {
          type: 'object',
          allOf: [
            {
              $ref: '#/components/schemas/Cafe'
            },
            {
              type: 'object',
              properties: {
                categories: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Array of category names'
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Array of tag names'
                }
              }
            }
          ]
        },
        CafeCategory: {
          type: 'object',
          required: [
            'id',
            'name'
          ],
          properties: {
            id: {
              type: 'string',
              description: 'The category ID'
            },
            name: {
              type: 'string',
              description: 'The category name'
            },
            image: {
              type: 'string',
              description: 'URL of the category image'
            }
          }
        },
        CafeTag: {
          type: 'object',
          required: [
            'id',
            'name'
          ],
          properties: {
            id: {
              type: 'string',
              description: 'The tag ID'
            },
            name: {
              type: 'string',
              description: 'The tag name'
            }
          }
        },
        CafePriceRange: {
          type: 'object',
          required: [
            'id',
            'name'
          ],
          properties: {
            id: {
              type: 'string',
              description: 'The price range ID'
            },
            name: {
              type: 'string',
              description: 'The price range name (e.g., $, $$, $$$)'
            },
            description: {
              type: 'string',
              description: 'Description of the price range'
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../routes/**/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
