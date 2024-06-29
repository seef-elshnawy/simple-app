import { InputType, Int, Field } from '@nestjs/graphql';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  price: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => Number)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  ProductName: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  instructions: string;
  
  @IsEnum(languagesEnum)
  @IsNotEmpty()
  lang: languagesEnum
}

@InputType()
export class CreateProductTranslation {
  @IsString()
  @IsNotEmpty()
  @Field()
  ProductName: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  instructions: string;
}
