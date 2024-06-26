import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserInput } from '../user/dto/create-user.input';
import { HelperService } from '@src/libs/utils/helper/helper.service';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  signInWithEmailInput,
  signInWithUserNameInput,
} from './dto/create-auth.input';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Sessions } from './entities/auth.entity';
import { UserTranslation } from '../user/entities/translationUser.entity';
import { UserTranslationInput } from '../user/dto/create-user-translation.dto';

@Injectable()
export class AuthService {
  constructor(
    private helper: HelperService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Sessions)
    private sessionsRepo: Repository<Sessions>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(UserTranslation)
    private userTranslation: Repository<UserTranslation>,
  ) {}
  async signUp(createUserInput: CreateUserInput) {
    try {
      const hash = await this.helper.hashPassword(createUserInput.password);
      const account = await this.userRepo.save({
        ...createUserInput,
        password: hash,
      });
      const code = this.helper.generateSessionCode();
      const token = await this.getToken(account.id, code);
      account.refreshToken = token.refreshToken;
      await this.userRepo.save(account);
      await this.sessionsRepo.save({
        refreshToken: token.refreshToken,
        sessionCode: code,
      });
       await this.userTranslation.save({
        base: account,
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        LanguageCode: account.lang
      })
      return token;
    } catch (err) {
      throw err;
    }
  }
  async getToken(id: number, sessionCode: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          sessionCode,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          sessionCode,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async updateAccessToken(id: number, refreshToken: string) {
    const sessionCode = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    }).sessionCode;
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          sessionCode,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
    ]);
    return accessToken;
  }
  async signInWithEmail(signWithEmail: signInWithEmailInput) {
    const account = await this.userRepo.findOne({
      where: { email: signWithEmail.email },
    });
    if (!account) throw new ForbiddenException('invalid credentials');
    const validatePassword = await this.helper.comparePassword(
      account.password,
      signWithEmail.password,
    );
    if (!validatePassword) throw new ForbiddenException('invalid credentials');
    const code = this.helper.generateSessionCode();
    const token = await this.getToken(account.id, code);
    await this.sessionsRepo.save({
      refreshToken: token.refreshToken,
      sessionCode: code,
    });
    // here we have a security gab wich is the old session doesn't deleted when user sign in to had new session wich can used by attackers
    // and take more space in database
    ///////////////
    const oldSessionCode = await this.jwtService.verify(account.refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    }).sessionCode;
    await this.sessionsRepo.delete({ sessionCode: oldSessionCode });
    ///////////////
    account.refreshToken = token.refreshToken;
    await this.userRepo.save(account);
    return token;
  }

  async signInWithUsername(signWithUsername: signInWithUserNameInput) {
    const account = await this.userRepo.findOne({
      where: { userName: signWithUsername.userName },
    });
    if (!account) throw new ForbiddenException('invalid credentials');
    const validatePassword = await this.helper.comparePassword(
      account.password,
      signWithUsername.password,
    );
    if (!validatePassword) throw new ForbiddenException('invalid credentials');
    const code = this.helper.generateSessionCode();
    const token = await this.getToken(account.id, code);
    await this.sessionsRepo.save({
      refreshToken: token.refreshToken,
      sessionCode: code,
    });
    // here we have a security gab wich is the old session doesn't deleted when user sign in to had new session wich can used by attackers
    // and take more space in database
    ///////////////
    const oldSessionCode = await this.jwtService.verify(account.refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    }).sessionCode;
    await this.sessionsRepo.delete({ sessionCode: oldSessionCode });
    ///////////////
    account.refreshToken = token.refreshToken;
    await this.userRepo.save(account);
    return token;
  }

  async signOutFromUserAccount(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) throw new ForbiddenException('account not found');
    const { refreshToken } = user;
    const { sessionCode } = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const session = await this.sessionsRepo.findOne({
      where: { sessionCode },
    });
    user.refreshToken = null;
    await this.sessionsRepo.delete(session);
    await this.userRepo.save(user);
    return 'logout successfull';
  }
}
