import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { HelperModule } from '@src/libs/utils/helper/helper.module';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperService } from '@src/libs/utils/helper/helper.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Sessions } from './entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sessions, User]),
    JwtModule.register({}),
    UserModule,
    HelperModule,
    ConfigModule.forRoot(),
  ],
  providers: [AuthResolver, AuthService, UserService, HelperService],
  exports: [AuthService],
})
export class AuthModule {}
