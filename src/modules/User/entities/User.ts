import {BaseEntity, BeforeInsert, Column, Entity, PrimaryColumn} from "typeorm";
import * as uuidv4 from 'uuid/v4';
import {Field, ID, ObjectType} from "type-graphql";

@ObjectType({ description: "The user model" })
@Entity()
export class User extends BaseEntity {
    @Field(type => ID)
    @PrimaryColumn("uuid")
    id: string;

    @Field()
    @Column("varchar", { length: 225 })
    email: string;

    @Field()
    @Column("text")
    password: string;

    @BeforeInsert()
    addId() {
        this.id = uuidv4();
    }
}
