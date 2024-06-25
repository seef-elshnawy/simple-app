import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import {
  Token,
  signInWithEmailInput,
  signInWithUserNameInput,
} from './dto/create-auth.input';
import { CurrentUser } from './decorator/user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/libs/Application/guards/auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Token)
  async signUp(@Args('createAuthInput') createUserInput: CreateUserInput) {
    return await this.authService.signUp(createUserInput);
  }

  @Mutation(() => Token)
  async signInWithEmail(
    @Args('signInWithEmailInput') signWithEmailInput: signInWithEmailInput,
  ) {
    return await this.authService.signInWithEmail(signWithEmailInput);
  }

  @Mutation(() => Token)
  async signInWithUsername(
    @Args('signInWithUsernameInput')
    signWithUsernameInput: signInWithUserNameInput,
  ) {
    return await this.authService.signInWithUsername(signWithUsernameInput);
  }
  
  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async signOut(@CurrentUser('id') id: string) {
    return await this.authService.signOutFromUserAccount(+id);
  }
}
