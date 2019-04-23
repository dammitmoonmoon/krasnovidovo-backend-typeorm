import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, InputType, ObjectType} from "type-graphql";

@ObjectType({ description: "The user model" })
@Entity("users")
export class User extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column("varchar", { length: 225 })
    username: string;

    @Field()
    @Column("varchar", { length: 225 })
    email: string;

    @Field()
    @Column("text")
    password: string;
}

@InputType({ description: "User registration input" })
export class RegisterUserInput {
    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;
}
