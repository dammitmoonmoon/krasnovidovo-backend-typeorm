import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Field, ID, InputType} from "type-graphql";
import {ObjectType} from "type-graphql/dist/decorators/ObjectType";

@ObjectType({ description: "The associate model" })
@Entity()
export class Associate {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    fullName: string;

    @Field()
    @Column()
    position: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    photo: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    email: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    link: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    personalPage: string;
}

@InputType({ description: "Update associate data" })
export class UpdateAssociateInput implements Partial<Associate> {
    @Field()
    readonly id: number;

    @Field({ nullable: true })
    fullName?: string;

    @Field({ nullable: true })
    position?: string;

    @Field({ nullable: true })
    photo?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    link?: string;
}

@InputType({ description: "New associate data" })
export class AddAssociateInput extends UpdateAssociateInput {
    @Field()
    fullName: string;

    @Field()
    position: string;

    @Field({ nullable: true })
    photo?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    link?: string;
}


