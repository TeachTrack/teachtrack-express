export const config = {
  basePath: '/api/v1',
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/teach-track',
  port: process.env.PORT || 9000,
  environment: process.env.NODE_ENV,
  corsUrl: process.env.CORS_URL,
  jwtSecret: process.env.JWT_SECRET || 'jwtsecred009233',
  pagination: {
    page: '1',
    limit: '10',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    contentCacheDuration: parseInt(process.env.REDIS_CONTENT_CACHE_DURATION_MILLIS || '60000'),
  },
  caching: {
    contentCacheDuration: parseInt(process.env.CONTENT_CACHE_DURATION_MILLIS || '600000'),
  },
};
