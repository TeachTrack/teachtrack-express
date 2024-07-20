import { client } from '../../configs/redis.config';
import { Request, Response } from '../../utils/interfaces/express.interface';

export const clearCache = async (req: Request, res: Response) => {
  try {
    await client.flushDb();
    res.json({ message: 'Database flushed' });
  } catch (err) {
    res.status(500).json({ message: 'Error flushing database', error: err });
  }
};
