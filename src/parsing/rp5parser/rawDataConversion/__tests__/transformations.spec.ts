import {
    transformClCmCloudData,
    transformCloudCover,
    transformTimeString,
    transformPrecipitationData,
    transformSnowDepthData, transformDefaultData
} from "../transformations";
import {commonStrings} from "../params";

const testCloudCover = {
    noClouds: {
        input: commonStrings.noClouds,
        output: [0],
    },
    percentageOneHundred: {
        input: '100%.',
        output: [100],
    },
    percentageZero: {
        input: '0%.',
        output: [0],
    },
    percentageSingle: {
        input: '40%.',
        output: [40],
    },
    percentageDouble: {
        input: '20–30%.',
        output: [20, 30],
    },
    percentageDoubleSpacious: {
        input: '70 – 80%.',
        output: [70, 80],
    },
    percentageMoreButNoMore: {
        input: '90  или более, но не 100%',
        output: [90, 100],
    },
    percentageLessButNoLess: {
        input: '10%  или менее, но не 0',
        output: [0, 10],
    },
    unusualString: {
        input: 'Небо не видно из-за тумана и/или других метеорологических явлений.',
        output: undefined,
    },
};

const ClCmCloudData = {
    noCloudsCl: {
        input: 'Слоисто-кучевых, слоистых, кучевых или кучево-дождевых облаков нет.',
        output: false,
    },
    noCloudsCm: {
        input: 'Высококучевых, высокослоистых или слоисто-дождевых облаков нет.',
        output: false,
    },
    hasCloudsCl: {
        input: 'Кучевые и слоисто-кучевые (но не слоисто-кучевые, образовавшиеся из кучевых), основания расположены на разных уровнях.',
        output: true,
    },
    hasCloudsCm: {
        input: 'Высококучевые просвечивающие, расположенные на одном уровне.',
        output: true,
    },
    unknownStatus: {
        input: '',
        output: undefined,
    }
};

const precipitationData = {
    noPrecipitation: {
        input: commonStrings.noPrecipitation,
        output: 0,
    },
    almostNoPrecipitation: {
        input: commonStrings.almostNoPrecipitation,
        output: 0,
    },
    noData: {
        input: '',
        output: undefined,
    },
    randomString: {
        input: 'Good-bye and hello, as always',
        output: undefined,
    },
    precipitationValue: {
        input: '0.9',
        output: 0.9
    },
};

const snowDepthData = {
    lessThan: {
        input: 'Менее 0.5',
        output: [0, 0.5],
    },
    equals: {
        input: '4.1',
        output: [4.1],
    },
    noData: {
        input: '',
        output: undefined,
    }
};

const defaultData = {
    numeric: {
        input: '1.3',
        output: 1.3,
    },
    string: {
        input: 'Ветер, дующий с северо-запада',
        output: 'Ветер, дующий с северо-запада',
    },
    noData: {
        input: '',
        output: void 0,
    }
}

const testData = {
    testDate: '01.04.2019 12:00',
    testCloudCover,
    ClCmCloudData,
    precipitationData,
    snowDepthData,
    defaultData,
};

describe('Test data rawDataConversion functions', () => {

    test('Date string is converted into a Date object', () => {
        expect(transformTimeString(testData.testDate)).toBeTruthy();
    });

    const testCloudCover = testData.testCloudCover;
    const testCloudCoverKeys = Object.keys(testCloudCover);
    test('Cloud Cover data is correctly parsed', () => {
        testCloudCoverKeys.forEach(key => {
            return expect(transformCloudCover(testCloudCover[key].input)).toEqual(testCloudCover[key].output);
        });
    });

    const ClCmCloudData = testData.ClCmCloudData;
    const testClCmCloudDataKeys = Object.keys(ClCmCloudData);
    test('Cl and Cm cloud data is correctly parsed', () => {
        testClCmCloudDataKeys.forEach(key => {
            return expect(transformClCmCloudData(ClCmCloudData[key].input)).toEqual(ClCmCloudData[key].output);
        });
    });

    const precipitationData = testData.precipitationData;
    const precipitationDataKeys = Object.keys(precipitationData);
    test('Precipitation data is correctly parsed', () => {
        precipitationDataKeys.forEach(key => {
            return expect(transformPrecipitationData(precipitationData[key].input)).toBe(precipitationData[key].output);
        });
    });

    const snowDepthData = testData.snowDepthData;
    const snowDepthDataKeys = Object.keys(snowDepthData);
    test('Snow depth data is correctly parsed', () => {
        snowDepthDataKeys.forEach(key => {
            return expect(transformSnowDepthData(snowDepthData[key].input)).toEqual(snowDepthData[key].output);
        });
    });

    const defaultData = testData.defaultData;
    const defaultDataKeys = Object.keys(defaultData);
    test('Default data is correctly parsed', () => {
        defaultDataKeys.forEach(key => {
            return expect(transformDefaultData(defaultData[key].input)).toEqual(defaultData[key].output);
        });
    });
});
