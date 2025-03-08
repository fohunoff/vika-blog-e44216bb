
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        }
      }
    }
  },
  apis: ['./src/server/routes/*.js', './src/server/controllers/*.js']
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
