import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import {
  CreateProductInput,
  CreateProductTranslationInput,
} from './dto/create-product.input';
import {
  UpdateProductInput,
  UpdateProductTranslation,
} from './dto/update-product.input';
import { CurrentUser } from '../auth/decorator/user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/libs/Application/guards/auth.guard';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import { ProductTranslation } from './entities/translationProduct.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput')
    createProductInput: CreateProductInput,
    @Args('createProductTranslationInput')
    createProductTranslationInput: CreateProductTranslationInput,
    @CurrentUser('id') userId: number,
  ) {
    return await this.productService.CreateProduct(
      createProductInput,
      createProductTranslationInput,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => [Product])
  findAllProducts(@CurrentUser('lang') lang: languagesEnum) {
    return this.productService.findAllProducts();
  }

  @UseGuards(AuthGuard)
  @Query(() => Product, { nullable: true })
  findOneProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findOneProduct(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @Args('updateProductTranslationInput')
    updateProductTranslation: UpdateProductTranslation,
  ) {
    return this.productService.updateProduct(
      updateProductInput.Id,
      updateProductInput,
      updateProductTranslation,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  removeProduct(@Args('id') id: number) {
    return this.productService.removeProduct(id);
  }

  @ResolveField(() => ProductTranslation, { nullable: true })
  async getTranslation(
    @Parent() product: Product,
    @CurrentUser('lang') lang: languagesEnum,
  ) {
    return await this.productService.getProductsTranslationByUserLang(
      lang,
      product,
    );
  }
}
