import {Field, ObjectType} from "type-graphql";
import {ErrorCodes} from "../../../common/errors";

@ObjectType({ description: "Error codes" })
export class ErrorCode {
    @Field(type => ErrorCodes)
    errorCode: ErrorCodes;
}
