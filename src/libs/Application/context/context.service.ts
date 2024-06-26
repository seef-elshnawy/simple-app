import { User } from '@src/libs/modules/user/entities/user.entity';
import { IContextInterface } from './context.interface';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sessions } from '@src/libs/modules/auth/entities/auth.entity';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/libs/modules/auth/auth.service';

@Injectable()
export class ContextService implements IContextInterface {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Sessions)
    private sessionRepo: Repository<Sessions>,
    private authService: AuthService,
  ) {}
  async getRequestFromReqHeaders(req: Request): Promise<User> {
    try {
      // try to access user from access token
      const token = this.getAuth(req);
      if (!token) return null;
      let { sessionCode } = this.jwt.verify(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });
      let { id } = this.jwt.verify(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });
      // if access token is invalid
      const checkIfSessionIsExist = await this.sessionRepo.find({
        where: { sessionCode },
      });
      // if access is valid we will check if had valid session
      if (!checkIfSessionIsExist || checkIfSessionIsExist.length === 0)
        return null;
      const user = await this.userRepo.findOne({
        where: { id },
      });
      if (!user) return null;
      return user;
    } catch (err) {
      // console.log(req.headers.refreshtoken)

      if (req.headers.refreshtoken) {
        return await this.getReqFromHeaderIfAccessIsInvalid(req);
      }
      return null;
    }
  }
  getAuth(request: Request): string {
    if (
      request &&
      request.headers &&
      (request.headers.Authorization || request.headers.authorization)
    ) {
      let auth: string;
      if (request.headers.Authorization)
        auth = <string>request.headers.Authorization;
      if (request.headers.authorization) auth = request.headers.authorization;
      return auth.split(' ')[1];
    }
    return null;
  }

  async updateToken(refreshToken: string, user: User) {
    const sessionCode = this.jwt.verify(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
    const isValidSession = await this.sessionRepo.find({
      where: { sessionCode },
    });
    if (!isValidSession) return null;
    const newGeneratedCode = await this.authService.getToken(
      user.id,
      sessionCode,
    );
    return newGeneratedCode.accessToken;
  }
  async getReqFromHeaderIfAccessIsInvalid(req: Request) {
    const { refreshtoken } = req.headers;
    const user = await this.userRepo.findOne({
      where: { refreshToken: (<string>refreshtoken).split(' ')[1] },
    });
    if (!user) return null;
    // generate new access token
    const token = await this.authService.updateAccessToken(
      user.id,
      user.refreshToken,
    );
    if (!token) return null;
    // get session code from access token
    let codeFromAccessToken = this.jwt.verify(token, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
    }).sessionCode;
    const checkIfSessionIsExist = await this.sessionRepo.find({
      where: { sessionCode: codeFromAccessToken },
    });
    if (!checkIfSessionIsExist || checkIfSessionIsExist.length === 0)
      return null;
    return user;
  }
}
