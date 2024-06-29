import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ProductTranslation } from './translationProduct.entity';

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  Id: number;
  
  @Field({nullable:true})
  ProductName: string

  @Field({nullable:true})
  description: string

  @Field({nullable:true})
  instructions: string

  @Field()
  @Column()
  price: string

  @Field()
  @Column()
  amount: number

  @ManyToOne(type=> User, (user)=> user.product)
  user: User

  @Column()
  @JoinColumn()
  userId: number

  @OneToMany((type)=> ProductTranslation, translation=>translation.base, {eager: true})
  translation: ProductTranslation[]
}
