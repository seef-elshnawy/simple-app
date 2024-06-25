import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { FindUserInput } from './dto/find-unique-user.input';
import { AuthGuard } from '@src/libs/Application/guards/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [User])
  async findAll() {
    return await this.userService.findAllAccounts();
  }
  @UseGuards(AuthGuard)
  @Query(() => User)
  findOne(@Args('input') input: FindUserInput): Promise<User> {
    return this.userService.findOneAccount(+input.id);
  }

  @Mutation(() => String)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.updateAccount(
      updateUserInput.id,
      updateUserInput,
    );
  }

  @Mutation(() => String)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.removeAccount(id);
  }
}
