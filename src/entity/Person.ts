import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Field, ID, InputType} from "type-graphql";
import {ObjectType} from "type-graphql/dist/decorators/ObjectType";

@ObjectType({ description: "The person model" })
@Entity()
export class Person {
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
}

@ObjectType({ description: "Deleted Person" })
export class DeletedPerson {
    @Field({ nullable: true })
    fullName: string;

    @Field({ nullable: true })
    position: string;

    @Field({ nullable: true })
    photo: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    link: string;
}

@InputType({ description: "Update person data" })
export class UpdatePersonInput implements Partial<Person> {
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

@InputType({ description: "New person data" })
export class AddPersonInput extends UpdatePersonInput {
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


