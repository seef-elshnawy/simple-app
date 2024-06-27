import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { FindUserInput } from './dto/find-unique-user.input';
import { AuthGuard } from '@src/libs/Application/guards/auth.guard';
import { UserTranslation } from './entities/translationUser.entity';
import { CurrentUser } from '../auth/decorator/user.decorator';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import {
  UserTranslationInput,
  changeLanguageInput,
} from './dto/create-user-translation.dto';
import { log } from 'console';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  
  @UseGuards(AuthGuard)
  @Query(() => [User])
  async findAll() {
    return await this.userService.findAllUsers();
  }
  @UseGuards(AuthGuard)
  @Query(() => User)
  async findOne(
    @Args('input') input: FindUserInput,
    @CurrentUser('lang') lang: languagesEnum,
  ): Promise<User> {
    return await this.userService.findOneUser(+input.id, lang);
  }

  @Mutation(() => String)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.updateUser(
      updateUserInput.id,
      updateUserInput,
    );
  }

  @Mutation(() => UserTranslation)
  async translateUserFields(
    @CurrentUser() user: User,
    @CurrentUser('lang') lang: languagesEnum,
    @Args('fields') userTranslationInput: UserTranslationInput,
  ) {
    return await this.userService.translateUserFields(
      user,
      userTranslationInput,
      lang,
    );
  }

  @Mutation(() => String)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.removeUser(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  changeUserLang(
    @CurrentUser() user: User,
    @Args('input') input: changeLanguageInput,
  ) {
    return this.userService.changeUserLang(user, input);
  }
}
