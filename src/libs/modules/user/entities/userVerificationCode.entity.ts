import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserVerificationCodeUseCaseEnum } from '@src/libs/utils/user.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class UserVerificationCode{
    
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    useCase: UserVerificationCodeUseCaseEnum
    
    @Field()
    @Column()
    code: string

    @Field()
    @ManyToOne(()=> User, {onDelete: 'CASCADE', onUpdate: "CASCADE"})
    user: User 

    @Column({ type: 'timestamp' })
    expiryDate: Date;
}