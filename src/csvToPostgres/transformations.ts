const transformTimeString = (value: string): Date => new Date();

const noClouds = "Облаков нет.";

const transformCloudCover = (value: string): number[]|null => {
    if (value == noClouds) {
        return [0];
    }

    const regexToExtractNumbers = /[+-]?\d+(?:\.\d+)?/g;
    let match;
    const numericValues = [];
    while (match = regexToExtractNumbers.exec(value)) {
        numericValues.push(Number(match[0]));
    }

    return numericValues.length ? numericValues.sort((a, b) => a - b) : null;
}

export {
    transformTimeString,
    transformCloudCover,
};