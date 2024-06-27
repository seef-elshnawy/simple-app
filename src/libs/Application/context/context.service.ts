import { User } from '@src/libs/modules/user/entities/user.entity';
import { IContextInterface } from './context.interface';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sessions } from '@src/libs/modules/auth/entities/auth.entity';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/libs/modules/auth/auth.service';
import { log } from 'console';

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
  async getRequestFromReqHeaders(req: Request, res: Response): Promise<User> {
    try {
      const { accessToken, refreshToken } = this.getAuth(req);

      if (!accessToken || !refreshToken) return null;

      let { sessionCode, id } = await this.jwt.verify(accessToken, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });
      let rtSessionCode = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      }).sessionCode;

      if (rtSessionCode !== sessionCode) return null;

      const user = await this.userRepo.findOne({
        where: {
          id,
          session: {
            sessionCode,
          },
        },
        relations: ['session'],
      });
      if (!user) return null;
      return user;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        if (req.headers.refreshtoken) {
          return await this.getReqFromHeaderIfAccessIsInvalid(req, res);
        }
      }
      return null;
    }
  }
  getAuth(request: Request): { accessToken: string; refreshToken: string } {
    if (
      request &&
      request.headers &&
      (request.headers.Authorization ||
        request.headers.authorization ||
        request.headers.refreshToken)
    ) {
      let auth: string;
      if (request.headers.Authorization)
        auth = <string>request.headers.Authorization;
      if (request.headers.authorization) auth = request.headers.authorization;
      const accessToken = auth.split(' ')[1];
      const refreshToken = (<string>request.headers.refreshtoken).split(' ')[1];
      return {
        accessToken,
        refreshToken,
      };
    }
    return null;
  }

  async getReqFromHeaderIfAccessIsInvalid(req: Request, res: Response) {
    const { refreshtoken } = req.headers;
    console.log('run', new Date());
    const { accessToken, newRefreshToken, id, sessionCode } = await this.authService.updateToken(
      (<string>refreshtoken).split(' ')[1],
    );
    if (!accessToken) return null;
    const user = await this.userRepo.findOne({
      where: {
        id,
        session: {
          sessionCode,
        },
      },
    });
    if (!user) return null;
    res.appendHeader('accessToken', accessToken);
    res.appendHeader('refreshToken', newRefreshToken)
    return user;
  }
}
