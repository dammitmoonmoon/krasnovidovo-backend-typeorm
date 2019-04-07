import {getConnection} from "typeorm";
import {RP5MeteoData} from "../entity";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

// const dummyData =
//     { localTime: new Date('2019-04-07T09:36:00.492Z'),
//     airTempAboveGround: 2.3,
//     atmPressureStation: 751.9,
//     atmPressureSea: 769.3,
//     humidity: 53,
//     windDirection: 'Ветер, дующий с северо-северо-запада',
//     windSpeed: 1,
//     cloudCover: [ 0 ],
//     minAirTemp: undefined,
//     maxAirTemp: 9.9,
//     cloudsCl: undefined,
//     ClCmCloudCover: undefined,
//     cloudsCm: undefined,
//     dewPointTemp: -6.5,
//     precipitation: 0,
//     precipitationAccumulationTime: 12,
//     snowDepth: undefined };

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
