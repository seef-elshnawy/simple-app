import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column()
  firstName: string;
  @Field()
  @Column()
  lastName: string;
  @Field()
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;

  @Field()
  @Column({ unique: true })
  userName: string;

  @Index()
  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken: string;
}
