import * as parse from 'csv-parse';
import * as fs from 'fs';
import { MeteoHeaderVariables, RemappableMeteoHeaders} from "./params";
import {transformCloudCover, transformTimeString} from "./transformations";

const DUMMY = './src/csvToPostgres/rawData/meteo1dummy.csv';

const mapIndexToTitle = {};

const parserOptions: parse.Options = {
    trim: true,
    comment: '#',
    delimiter: ';',
    skip_empty_lines: true,
    relax_column_count: true,
    to_line: 9,
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
                default:
                    return value;
            }
        }
    }
};

const parser = parse(parserOptions, (err, data) => {
    console.log('data', data);
});

fs.createReadStream(DUMMY).pipe(parser);


