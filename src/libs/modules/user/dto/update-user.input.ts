import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

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

  @IsEnum(languagesEnum)
  @Field(() => languagesEnum, {nullable:true})
  lang?: languagesEnum;

  @Field({ nullable: true })
  refreshToken: string;
}

@InputType()
export class ChangePassword {
  @Field(() => Int)
  id: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  prevPassword: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  confirmPassword: string;

  @Field({ nullable: true })
  refreshToken: string;
}

@InputType()
export class ForgetPassword {
  @Field(() => Int)
  id: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  confirmPassword: string;

  @Field({ nullable: true })
  refreshToken: string;
}
