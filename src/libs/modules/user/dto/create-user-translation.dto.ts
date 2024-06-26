import { Field, InputType } from '@nestjs/graphql';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UserTranslationInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  lastName: string;
}

@InputType()
export class changeLanguageInput {
  @IsEnum(languagesEnum)
  @Field(() => languagesEnum)
  lang: languagesEnum;
}
