import { Global, Module } from '@nestjs/common';
import { IContextAuthToken } from './context.interface';
import { ContextService } from './context.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/libs/modules/user/entities/user.entity';
import { Sessions } from '@src/libs/modules/auth/entities/auth.entity';
import { AuthModule } from '@src/libs/modules/auth/auth.module';
import { AuthService } from '@src/libs/modules/auth/auth.service';

@Global()
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User, Sessions]), AuthModule],
  providers: [{ useClass: ContextService, provide: IContextAuthToken }],
  exports: [{ useClass: ContextService, provide: IContextAuthToken }],
})
export class ContextModule {}
