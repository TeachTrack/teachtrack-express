export const config = {
  basePath: "/api/v1",
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017/teach-track",
  port: process.env.PORT || 9000,
  environment: process.env.NODE_ENV,
  corsUrl: process.env.CORS_URL,
  redis: {
    host: process.env.REDIS_HOST || "",
    port: parseInt(process.env.REDIS_PORT || "0"),
    password: process.env.REDIS_PASSWORD || "",
  },
  caching: {
    contentCacheDuration: parseInt(
      process.env.CONTENT_CACHE_DURATION_MILLIS || "600000"
    ),
  },
};
