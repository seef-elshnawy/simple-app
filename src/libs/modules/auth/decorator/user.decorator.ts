import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  async (data: keyof User, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { currentUser } = ctx.getContext();
    if (data) {
      return await currentUser[data];
    }
    return await currentUser;
  },
);