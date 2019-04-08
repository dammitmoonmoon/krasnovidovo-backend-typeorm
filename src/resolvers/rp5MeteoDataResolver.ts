import {getRepository, Repository} from "typeorm";
import {Person, RP5MeteoData} from "../entity";
import {Arg, Int, Query, Resolver} from "type-graphql";
import {AddPersonInput} from "../entity/Person";
import {GetFilteredMeteoDataInput, GetMeteoDataInput} from "../entity/RP5MeteoData";

@Resolver(of => RP5MeteoData)
export class RP5MeteoDataResolver {
    private readonly repository: Repository<RP5MeteoData>;
    constructor() {
        this.repository = getRepository(RP5MeteoData);
    }

    @Query(returns => [RP5MeteoData], { nullable: true })
    async rp5Data(
        @Arg("filter")
            meteoDataFilter: GetMeteoDataInput,
    ): Promise<RP5MeteoData[]> {
        const data = this.repository
            .createQueryBuilder('')
            .offset(meteoDataFilter.offset)
            .limit(meteoDataFilter.limit)
            .getMany();
        return data;
    }

    @Query(returns => [RP5MeteoData], { nullable: true })
    async rp5DataByDate(
        @Arg("filter")
            meteoDataFilter: GetFilteredMeteoDataInput,
    ): Promise<RP5MeteoData[]> {
        if (meteoDataFilter.dateFrom > meteoDataFilter.dateTo ) {
            throw new Error(`Input error: dateFrom is larger than dateTo`);
        }
        const dataByDate = this.repository
            .createQueryBuilder('RP5MeteoData')
            .where("RP5MeteoData.localTime BETWEEN :dateFrom AND :dateTo", { dateFrom: meteoDataFilter.dateFrom, dateTo: meteoDataFilter.dateTo })
            .getMany();
        return dataByDate;
    }
}
