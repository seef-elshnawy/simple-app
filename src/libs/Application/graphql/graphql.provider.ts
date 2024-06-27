import { Inject, Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { User } from '@src/libs/modules/user/entities/user.entity';
import { join } from 'path';
import {
  IContextAuthToken,
  IContextInterface,
} from '../context/context.interface';
import { Request, Response } from 'express';
import { ApolloDriverConfig } from '@nestjs/apollo';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    @Inject(IContextAuthToken)
    private readonly authService: IContextInterface,
  ) {}
  createGqlOptions(): ApolloDriverConfig {
    return {
      playground: true,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      cache: 'bounded',
      persistedQueries: false,
      csrfPrevention: true,
      // installSubscriptionHandlers: true,
      context: async ({ req, extra, res }) => {
        let currentUser: User;
        console.log('creating contextttttt');
        

        // Auth for subscription connections
        if (extra && extra.currentUser) currentUser = extra.currentUser;
        else currentUser = await this.authService.getRequestFromReqHeaders(<Request>req, <Response>res) 
        return {
          req,
          currentUser,
          res,
        };
      },
      subscriptions: {
        'graphql-ws': {
          onConnect: async (context) => {
            const { connectionParams, extra } = context;
            if (connectionParams) {
              const req = { headers: connectionParams };
              //   (extra as any).currentUser = await this.authService.getUserFromReqHeaders(
              //     <Request>req
              //   );
            }
          },
        },
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams) => {
            if (connectionParams) {
              const req = { headers: connectionParams };
              return {
                // currentUser: await this.authService.getUserFromReqHeaders(<Request>req)
              };
            }
          },
          onDisconnect() {},
        },
      },
    };
  }
}
