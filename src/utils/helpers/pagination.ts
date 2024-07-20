import { Document, Model } from 'mongoose';
import { config } from '../../configs/config';

export interface PaginateOptions {
  page?: string;
  limit?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  totalData: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class Paginator<T extends Document> {
  private model: Model<T>;
  private readonly page: number;
  private readonly limit: number;
  private query: Record<string, any>;
  private projection: Record<string, any> | undefined;
  private sort: Record<string, any> | undefined;

  constructor(
    model: Model<T>,
    options: PaginateOptions,
    query: Record<string, any> = {},
    projection?: Record<string, any>,
    sort?: Record<string, any>,
  ) {
    this.model = model;
    this.page = parseInt(options.page || config.pagination.page);
    this.limit = parseInt(options.limit || config.pagination.limit);
    this.query = query;
    this.projection = projection;
    this.sort = sort;
  }

  private getOffset(): number {
    return (this.page - 1) * this.limit;
  }

  private async getTotalDocs(): Promise<number> {
    return this.model.countDocuments(this.query).exec();
  }

  public async paginate(): Promise<PaginatedResult<T>> {
    const offset = this.getOffset();
    const data = await this.model
      .find(this.query, this.projection)
      .sort(this.sort)
      .skip(offset)
      .limit(this.limit)
      .exec();
    const totalData = await this.getTotalDocs();
    const totalPages = Math.ceil(totalData / this.limit);

    return {
      data,
      totalData,
      totalPages,
      page: this.page,
      limit: this.limit,
      hasNextPage: this.page < totalPages,
      hasPrevPage: this.page > 1,
    };
  }
}

export default Paginator;
