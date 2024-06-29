import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
export class Sessions {
  @PrimaryGeneratedColumn()
  @Field()
  sessionId: number;

  @Column()
  @Index()
  @Field()
  sessionCode: string;

  @ManyToOne(() => User, (user) => user.session, {
    onDelete: 'CASCADE',
    onUpdate: "CASCADE",
    eager: true
  })
  user: User;

  @Column()
  @JoinColumn()
  userId: number;
}
