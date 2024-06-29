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
import { log } from 'console';

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
      await this.checkOfUserNameAndEmailAreUnique(
        createUserInput.email,
        createUserInput.userName,
      );
      const hashPassword = await this.helper.hashPassword(
        createUserInput.password,
      );
      const user = await this.userRepo.save({
        ...createUserInput,
        password: hashPassword,
      });
      const code = this.helper.generateSessionCode();
      const token = await this.createToken(user.id, code);

      await this.userTranslation.save({
        base: user,
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        LanguageCode: user.lang,
      });

      return token;
    } catch (err) {
      throw err;
    }
  }

  async checkOfUserNameAndEmailAreUnique(email: string, userName: string) {
    const checkOfEmailIsUnique = await this.userRepo.findOne({
      where: { email },
    });
    if (checkOfEmailIsUnique)
      throw new ForbiddenException('email is used before');
    const checkOfUserNameIsUnique = await this.userRepo.findOne({
      where: { userName },
    });
    if (checkOfUserNameIsUnique)
      throw new ForbiddenException('userName is used before');
  }

  async createToken(id: number, sessionCode: string) {
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
    console.log(sessionCode);

    await this.sessionsRepo.save({
      userId: id,
      sessionCode,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async updateToken(token: string) {
    console.log('run from updateToken');
    const { id, sessionCode } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const NewSessionCode = this.helper.generateSessionCode();
    const session = await this.sessionsRepo.findOne({ where: { sessionCode } });
    if (!session) throw new ForbiddenException('UnAuthorized');
    console.log(sessionCode, 'SessionCode')
    console.log(NewSessionCode, 'NewSessionCode')
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          sessionCode:NewSessionCode,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          sessionCode: NewSessionCode,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    session.sessionCode = NewSessionCode;
    await this.sessionsRepo.save(session);
    return {
      accessToken,
      newRefreshToken: refreshToken,
      id,
      sessionCode: NewSessionCode,
    };
  }
  async signInWithEmail(signWithEmail: signInWithEmailInput) {
    const user = await this.userRepo.findOne({
      where: { email: signWithEmail.email },
      loadEagerRelations: true,
    });
    if (!user) throw new ForbiddenException('invalid credentials');
    const validatePassword = await this.helper.comparePassword(
      user.password,
      signWithEmail.password,
    );
    if (!validatePassword) throw new ForbiddenException('invalid credentials');
    const code = this.helper.generateSessionCode();
    const token = await this.createToken(user.id, code);
    return token;
  }

  async signInWithUsername(signWithUsername: signInWithUserNameInput) {
    const user = await this.userRepo.findOne({
      where: { userName: signWithUsername.userName },
      loadEagerRelations: true,
    });
    if (!user) throw new ForbiddenException('invalid credentials');
    const validatePassword = await this.helper.comparePassword(
      user.password,
      signWithUsername.password,
    );
    if (!validatePassword) throw new ForbiddenException('invalid credentials');
    const code = this.helper.generateSessionCode();
    const token = await this.createToken(user.id, code);
    return token;
  }

  async signOutFromUserAccount(user: User) {
    if (!user) throw new ForbiddenException('account not found');
    await this.sessionsRepo.delete({ userId: user.id });
    return 'logout successfull';
  }
}
