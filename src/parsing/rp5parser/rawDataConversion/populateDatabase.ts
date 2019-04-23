import {getConnection} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {RP5MeteoData} from "../../../modules/RP5MeteoData";

const populateDatabase = async (data: QueryDeepPartialEntity<RP5MeteoData>[]) => {
    await getConnection()
        .createQueryBuilder()
        .insert()
        .into(RP5MeteoData)
        .values(data)
        .execute();
};

export {
    populateDatabase
};
