/**
 * OpenAPI 3.0 Swagger Documentation Route
 */
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Telegram Cloud Storage Platform API',
    version: '1.0.0',
    description: 'Production-ready REST API for Telegram CDN Cloud Storage Platform with Advanced WebApp & Super Admin Panel'
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Development Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      TelegramInitData: {
        type: 'apiKey',
        in: 'header',
        name: 'X-Telegram-Init-Data',
        description: 'Standard Telegram WebApp initData query string'
      }
    }
  },
  security: [
    { BearerAuth: [] },
    { TelegramInitData: [] }
  ],
  paths: {
    '/auth/telegram-login': {
      post: {
        summary: 'Login via Telegram WebApp initData',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  initData: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Successful authentication with access and refresh tokens' }
        }
      }
    },
    '/files': {
      get: {
        summary: 'List user cloud storage files with filters',
        tags: ['Files'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'folderId', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Paginated list of user files' }
        }
      },
      post: {
        summary: 'Register single Telegram CDN file reference',
        tags: ['Files'],
        responses: {
          '201': { description: 'File reference saved successfully' }
        }
      }
    },
    '/files/parallel-upload': {
      post: {
        summary: 'Batch parallel upload of Telegram CDN files (10-1000 files)',
        tags: ['Files'],
        responses: {
          '202': { description: 'Job enqueued for background worker pool' }
        }
      }
    },
    '/folders': {
      get: {
        summary: 'List user folders (flat or nested tree)',
        tags: ['Folders'],
        responses: {
          '200': { description: 'List of folders' }
        }
      }
    },
    '/search': {
      get: {
        summary: 'Instant Global Search with PostgreSQL FTS + Redis Cache',
        tags: ['Search'],
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Search results' }
        }
      }
    },
    '/admin/analytics': {
      get: {
        summary: 'Super Admin Live System Health & Metrics',
        tags: ['Admin Panel'],
        responses: {
          '200': { description: 'Comprehensive server monitoring data' }
        }
      }
    }
  }
};

router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'Telegram Cloud Storage - OpenAPI Docs'
}));

module.exports = router;
