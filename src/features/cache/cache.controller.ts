import { client, removeCachedDocument } from '../../configs/redis.config';
import { Request, Response } from '../../utils/interfaces/express.interface';

export const clearCache = async (req: Request, res: Response) => {
  try {
    await client.flushAll();
    res.json({ message: 'Database flushed' });
  } catch (err) {
    res.status(500).json({ message: 'Error flushing database', error: err });
  }
};
