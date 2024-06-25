import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Sessions {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  sessionId: string;

  @Column()
  @Field()
  sessionCode: string;

  @Index()
  @Column()
  @Field()
  refreshToken: string;
}
