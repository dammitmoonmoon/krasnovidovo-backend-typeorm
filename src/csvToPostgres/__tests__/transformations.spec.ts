import {transformCloudCover, transformTimeString} from "../transformations";

const testCloudCover = {
    noClouds: {
        initial: 'Облаков нет.',
        final: [0],
    },
    percentageOneHundred: {
        initial: '100%.',
        final: [100],
    },
    percentageZero: {
        initial: '0%.',
        final: [0],
    },
    percentageSingle: {
        initial: '40%.',
        final: [40],
    },
    persentageDouble: {
        initial: '20–30%.',
        final: [20, 30],
    },
    percentageDoubleSpaceous: {
        initial: '70 – 80%.',
        final: [70, 80],
    },
    percentageMoreButNoMore: {
        initial: '90  или более, но не 100%',
        final: [90, 100],
    },
    percentageLessButNoLess: {
        initial: '10%  или менее, но не 0',
        final: [0, 10],
    },
    unusualString: {
        initial: 'Небо не видно из-за тумана и/или других метеорологических явлений.',
        final: null,
    },
};

const testData = {
    testDate: '01.04.2019 12:00',
    testCloudCover,
};

describe('Test data transformation functions', () => {
    test('Date stringis converted into Date object', () => {
        expect(transformTimeString(testData.testDate)).toBeTruthy();
    });
    const testCloudCover = testData.testCloudCover;
    const testCloudCoverKeys = Object.keys(testData.testCloudCover);
    test('Cloud Cover data is correctly parsed', () => {
        testCloudCoverKeys.forEach(key => {
            return expect(transformCloudCover(testCloudCover[key].initial)).toEqual(testCloudCover[key].final);
        });
    });
});