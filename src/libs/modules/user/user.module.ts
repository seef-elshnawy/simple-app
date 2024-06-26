import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HelperService } from '@src/libs/utils/helper/helper.service';
import { HelperModule } from '@src/libs/utils/helper/helper.module';
import { UserTranslation } from './entities/translationUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserTranslation]), HelperModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
