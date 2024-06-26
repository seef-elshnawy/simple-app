import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/translationProduct.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product, ProductTranslation])],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
