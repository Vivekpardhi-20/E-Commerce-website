import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(productData: Partial<Product>) {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async findAllPaginated(page: number, pageSize: number) {
    const [data, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      data,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
      currentPage: page,
      pageSize,
    };
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  update(id: number, productData: Partial<Product>) {
    return this.productRepository.update(id, productData);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
