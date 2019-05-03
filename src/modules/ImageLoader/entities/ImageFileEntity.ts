import {Field, ObjectType} from "type-graphql";

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
