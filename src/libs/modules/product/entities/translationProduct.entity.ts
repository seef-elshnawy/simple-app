import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Product } from "./product.entity";


@ObjectType()
@Entity()
export class ProductTranslation{
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  ProductName: string
  @Column()
  description: string
  @Column()
  instructions: string

  @Index()
  @ManyToOne(type=>Product, (base)=> base.translation, {
    onDelete: "CASCADE"
  })
  base: Product
}