import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class signInWithUserNameInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  userName: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  password: string;
}

@InputType()
export class signInWithEmailInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  password: string;
}

@ObjectType()
export class Token {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}
