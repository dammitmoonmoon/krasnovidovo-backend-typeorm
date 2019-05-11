import {Field, ID, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

@ObjectType({ description: "The user model" })
export class ImageFile {
    @Field()
    filename: string;
    @Field()
    mimetype: string;
    @Field()
    encoding: string;
    @Field()
    imageUrl: string;
}

@Entity("imageParams")
export class ImageParams extends BaseEntity {
    @PrimaryColumn("text")
    id: string;

    @Field()
    @Column("text")
    fileName: string;

    @Field()
    @Column("text")
    imageUrl: string;
}
