import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from './product.entity';
import { languagesEnum } from '@src/libs/Application/lang/lang.enum';

@ObjectType()
@Entity()
export class ProductTranslation {
  @PrimaryGeneratedColumn()
  id: number;
  @Field({nullable:true})
  @Column()
  ProductName: string;
  @Field({nullable:true})
  @Column()
  description: string;
  @Field({nullable:true})
  @Column()
  instructions: string;

  @Index()
  @ManyToOne((type) => Product, (base) => base.translation, {
    onDelete: 'CASCADE',
    onUpdate: "CASCADE"
  })
  base: Product;

  @Column({ default: languagesEnum.EN })
  @Field()
  lang: languagesEnum;
}
