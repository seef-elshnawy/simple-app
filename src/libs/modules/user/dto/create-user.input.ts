import { InputType, Int, Field } from '@nestjs/graphql';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Field({ nullable: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  refreshToken: string;
  
  @IsEnum(languagesEnum)
  @Field(() => languagesEnum, {nullable:true})
  lang?: languagesEnum;

}
