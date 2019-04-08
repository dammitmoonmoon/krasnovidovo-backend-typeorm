import {commonStrings, regexToExtractNumbers} from "./params";

const transformTimeString = (value: string): Date => {
    const date = value.substring(0,2);
    const month = value.substring(3,5);
    const remainder = value.substring(5);
    return new Date(`${month}.${date}${remainder}`);
};

const transformCloudCover = (value: string): number[]|undefined => {
    if (value == commonStrings.noClouds) {
        return [0];
    }

    let match;
    const numericValues = [];
    while (match = regexToExtractNumbers.exec(value)) {
        numericValues.push(Number(match[0]));
    };

    return numericValues.length ? numericValues.sort((a, b) => a - b) : undefined;
};

const transformClCmCloudData = (value: string): boolean|undefined  => value ? !value.endsWith(' нет.') : undefined;

const transformPrecipitationData = (value: string): number|undefined => {
    if (value === "") {
        return void 0;
    }
    if (Number(value)) {
        return Number(value);
    }
    if ( (commonStrings.noPrecipitation + commonStrings.almostNoPrecipitation).includes(value) ) {
        return 0;
    }
    return void 0;
};

const transformSnowDepthData = (value: string): number[]|undefined => {
    const numericValues = [];
    let match;
    if (value.toLowerCase().includes('менее')) {
        numericValues.push(0);
    };
    while (match = regexToExtractNumbers.exec(value)) {
        numericValues.push(Number(match[0]));
    };
    return numericValues.length ? numericValues : void 0;
};

const transformDefaultData = (value: string): number|string|undefined => {
    return value == "" ? void 0 : Number(value) ? Number(value) : value;
};

export {
    transformTimeString,
    transformCloudCover,
    transformClCmCloudData,
    transformPrecipitationData,
    transformSnowDepthData,
    transformDefaultData,
};
