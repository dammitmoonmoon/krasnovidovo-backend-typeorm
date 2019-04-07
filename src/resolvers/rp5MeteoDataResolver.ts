import {DeleteResult, getConnection, getRepository, InsertResult, Repository} from "typeorm";
import {Person, RP5MeteoData} from "../entity";
import {Arg, Int, Query, Resolver} from "type-graphql";

@Resolver(of => RP5MeteoData)
export class RP5MeteoDataResolver {
    private readonly repository: Repository<RP5MeteoData>;
    constructor() {
        this.repository = getRepository(RP5MeteoData);
    }

    @Query(returns => [RP5MeteoData], { nullable: true })
    async rp5Data(): Promise<RP5MeteoData[]> {
        return this.repository.find();
    }
}
