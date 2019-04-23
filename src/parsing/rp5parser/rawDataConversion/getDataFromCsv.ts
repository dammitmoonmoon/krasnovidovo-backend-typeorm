import * as parse from 'csv-parse';
import * as fs from 'fs';
import { MeteoHeaderVariables, RemappableMeteoHeaders} from "./params";
import {
    transformClCmCloudData,
    transformCloudCover, transformDefaultData,
    transformPrecipitationData, transformSnowDepthData,
    transformTimeString
} from "./transformations";
import {populateDatabase} from "./populateDatabase";

const DUMMY = './src/parsing/rp5parser/rawDataConversion/rawData';

const mapIndexToTitle = {};

const parserOptions: parse.Options = {
    trim: true,
    comment: '#',
    delimiter: ';',
    skip_empty_lines: true,
    relax_column_count: true,
    columns: header => header.map(
        column => MeteoHeaderVariables[column] || void 0
    ),
    cast: (value, context) => {
        if (context.header) {
            mapIndexToTitle[context.index] = value;
            return value;
        }
        else {
            const column = mapIndexToTitle[context.index];
            switch (column) {
                case RemappableMeteoHeaders.localTime: {
                    return transformTimeString(value);
                }
                case RemappableMeteoHeaders.cloudCover: {
                    return transformCloudCover(value);
                }
                case RemappableMeteoHeaders.cloudCover:
                case RemappableMeteoHeaders.ClCmCloudCover: {
                    return transformCloudCover(value);
                }
                case RemappableMeteoHeaders.cloudsCl:
                case RemappableMeteoHeaders.cloudsCm: {
                    return transformClCmCloudData(value);
                }
                case RemappableMeteoHeaders.precipitation: {
                    return transformPrecipitationData(value);
                }
                case RemappableMeteoHeaders.snowDepth: {
                    return transformSnowDepthData(value);
                }
                default:
                    return transformDefaultData(value);
            }
        }
    }
};

const parser = parse(parserOptions, (err, data) => {
    populateDatabase(data);
});

const parseCVSToPostgres = () => fs.createReadStream(DUMMY).pipe(parser);

export {
    parseCVSToPostgres
}


