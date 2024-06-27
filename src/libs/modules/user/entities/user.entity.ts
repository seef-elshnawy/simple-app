import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserTranslation } from './translationUser.entity';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';
import { Sessions } from '../../auth/entities/auth.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => UserTranslation, (translations) => translations.base, {
    eager: true,
  })
  translations: UserTranslation[];

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ unique: true })
  userName: string;

  @Field()
  @Column({ default: languagesEnum.EN })
  lang: languagesEnum;

  @OneToMany((type) => Sessions, (session) => session.user)
  session: Sessions[];
}
