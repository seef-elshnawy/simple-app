import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FindUserInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  id: string;
}
