import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Roles} from "../../../common/pgEnums";

@ObjectType({ description: "The user model" })
@Entity("users")
export class User extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(type => Roles)
    @Column({
        type: "enum",
        enum: Roles,
        default: [Roles.USER]
    })
    role: Roles;

    @Field()
    @Column("varchar", { length: 225 })
    username: string;

    @Field()
    @Column("text")
    password: string;

    @Field()
    @Column("varchar", { length: 225 })
    email: string;
}

@InputType({ description: "User registration input" })
export class RegisterUserInput {
    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field(type => Roles)
    role: Roles;
}


@InputType({ description: "User login input" })
export class UserLoginInput {
    @Field()
    username: string;

    @Field()
    password: string;
}
