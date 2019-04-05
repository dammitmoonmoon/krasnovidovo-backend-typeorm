import * as parse from 'csv-parse';
import * as fs from 'fs';
import {LOCALTIME, MeteoHeaderVariables, RemappableMeteoHeaders} from "./enums";

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
        column => column == LOCALTIME ?
            'localTime'
            : MeteoHeaderVariables[column] || void 0
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
                    return 'date';
                }
                case RemappableMeteoHeaders.cloudsCl: {
                    return 'Cl';
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


