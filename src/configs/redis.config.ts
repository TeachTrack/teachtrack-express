import * as redis from 'redis';
import { config } from './config';
import * as Logger from 'bunyan';

const log: Logger = Logger.createLogger({ name: 'redis' });

export const client = redis.createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

export const connectRedis = async () => {
  await client.connect();
};

client.on('error', function (error) {
  log.error('Redis Error:', error);
});

client.on('connect', () => log.info('connected to the redis'));

export async function cacheDocument<T>(cacheKey: string, document: T): Promise<void> {
  await client.set(cacheKey, JSON.stringify(document), { EX: config.redis.contentCacheDuration });
}

export async function removeCachedDocument<T>(cacheKey: string): Promise<void> {
  await client.del(cacheKey);
}

export async function getDocumentFromCache<T = any>(
  cacheKey: string,
  fetchFunction: () => Promise<T | undefined>,
): Promise<T | undefined> {
  const documentFromCache = (await client.get(cacheKey)) as null | string;
  let document = documentFromCache ? JSON.parse(documentFromCache) : null;
  if (!document) {
    document = await fetchFunction();
    if (document) {
      await cacheDocument<T>(cacheKey, document);
    }
  }
  return document;
}
