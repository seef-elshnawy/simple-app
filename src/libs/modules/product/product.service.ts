import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput, UpdateProductTranslation } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductTranslation } from './entities/translationProduct.entity';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductTranslation)
    private productTranslationRepo: Repository<ProductTranslation>,
  ) {}

  async CreateProduct(createProductInput: CreateProductInput, userId: number) {
    const productTranslation = this.productTranslationRepo.create({
      ProductName: createProductInput.ProductName,
      description: createProductInput.description,
      instructions: createProductInput.instructions,
      lang: createProductInput.lang,
    });
    await this.productTranslationRepo.save(productTranslation);
    const product = this.productRepo.create({
      ...createProductInput,
      userId,
      translation: [productTranslation],
    });
    await this.productRepo.save(product);
    const result = Object.assign(product, product.translation[0]);
    return result;
  }

  async getProductsTranslationByUserLang(
    lang: languagesEnum,
    product: Product,
  ) {
    const productTranslations = await this.productTranslationRepo.findOne({
      where: {
        base: product,
        lang,
      },
    });
    return productTranslations;
  }

  async findAllProducts() {
    const products = await this.productRepo.find();
    return products;
  }

  findOneProduct(Id: number) {
    const product = this.productRepo.findOne({
      where: { Id },
    });
    return product;
  }

  async updateProduct(
    Id: number,
    updateProductInput: UpdateProductInput,
    updateProductTranslationInput: UpdateProductTranslation,
  ) {
    const product = await this.productRepo.findOne({
      where: { Id },
    });
    const productTranslation = await this.productTranslationRepo.findOne({
      where: { base: product, lang: updateProductTranslationInput.lang },
    });
    if(!productTranslation || !product) throw new ForbiddenException('product not found')
    await this.productRepo.update(
      { Id },
      {
        ...updateProductInput,
      },
    );
    await this.productTranslationRepo.update({id: productTranslation.id},{
      ...updateProductTranslationInput
    })
    return 'product update successful';
  }
  removeProduct(id: number) {
    this.productRepo.delete({Id:id})
    return "product deleted successfull"
  }
}
