import { Field, ObjectType } from '@nestjs/graphql';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class UserTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar')
  LanguageCode: languagesEnum;

  @Index()
  @ManyToOne((type) => User, (base) => base.translations, {
    onDelete: 'CASCADE',
  })
  base: User;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;
}
