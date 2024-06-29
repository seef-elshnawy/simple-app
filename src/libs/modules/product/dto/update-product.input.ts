import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Number)
  Id:number

  @IsString()
  @IsNotEmpty()
  @Field(() => String,{nullable:true})
  price?: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => Number,{nullable:true})
  amount?: number;

}

@InputType()
export class UpdateProductTranslation {
  @IsString()
  @IsNotEmpty()
  @Field(() => String,{nullable:true})
  ProductName?: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String,{nullable:true})
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String,{nullable:true})
  instructions?: string;
  
  @IsEnum(languagesEnum)
  @IsNotEmpty()
  @Field(() => languagesEnum)
  lang: languagesEnum
}
