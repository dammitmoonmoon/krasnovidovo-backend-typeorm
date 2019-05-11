import {Query, Resolver} from "type-graphql";
import {ErrorCode} from "../entitites/ErrorCode";
import {ErrorCodes} from "../../../common/errors";

@Resolver(of => ErrorCode)
export class ErrorCodeResolver {
    @Query(returns => [ErrorCode])
    async getErrorCodes(): Promise<ErrorCode[]>{
        return Object.keys(ErrorCodes).map(key => ({errorCode: ErrorCodes[key]}));
    }
}
