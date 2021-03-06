const LOCALTIME = 'Местное время в Можайске';

const commonStrings = {
    noClouds: "Облаков нет.",
    noPrecipitation: "Осадков нет",
    almostNoPrecipitation: "Следы осадков",
};

const regexToExtractNumbers = /[+-]?\d+(?:\.\d+)?/g;

enum RemappableMeteoHeaders {
    localTime = 'Местное время в Можайске',
    windDirection = 'DD',
    cloudCover = 'N',
    ClCmCloudCover = 'Nh',
    precipitation = 'RRR',
    snowDepth = 'sss',
    cloudsCl = 'Cl',
    cloudsCm = 'Cm',
}

enum MeteoHeaderVariables {
    'Местное время в Можайске' = 'localTime',
    T = 'airTempAboveGround',
    Po = 'atmPressureStation',
    P = 'atmPressureSea',
    U = 'humidity',
    DD = 'windDirection',
    Ff = 'windSpeed',
    N = 'cloudCover',
    Tn = 'minAirTemp',
    Tx = 'maxAirTemp',
    Nh = 'ClCmCloudCover',
    Td = 'dewPointTemp',
    RRR = 'precipitation',
    tR = 'precipitationAccumulationTime',
    sss = 'snowDepth',
    Cl = 'cloudsCl',
    Cm = 'cloudsCm',
}

enum MeteoHeaderTitles {
    localTime = 'Местное время в Можайске',
    T = 'Температура воздуха (градусы Цельсия) на высоте 2 метра над поверхностью земли',
    Po = 'Атмосферное давление на уровне станции (миллиметры ртутного столба)',
    P = 'Атмосферное давление, приведенное к среднему уровню моря (миллиметры ртутного столба)',
    U = 'Относительная влажность (%) на высоте 2 метра над поверхностью земли',
    DD = 'Направление ветра (румбы) на высоте 10-12 метров над земной поверхностью, осредненное за 10-минутный период, непосредственно предшествовавший сроку наблюдения',
    Ff = 'Cкорость ветра на высоте 10-12 метров над земной поверхностью, осредненная за 10-минутный период, непосредственно предшествовавший сроку наблюдения (метры в секунду)',
    N = 'Общая облачность',
    Tn = 'Минимальная температура воздуха (градусы Цельсия) за прошедший период (не более 12 часов)',
    Tx = 'Максимальная температура воздуха (градусы Цельсия) за прошедший период (не более 12 часов)',
    Cl = 'Слоисто-кучевые, слоистые, кучевые и кучево-дождевые облака',
    Cm = 'Высококучевые, высокослоистые и слоисто-дождевые облака',
    Nh = 'Количество всех наблюдающихся облаков Cl или, при отсутствии облаков Cl, количество всех наблюдающихся облаков Cm',
    Td = 'Температура точки росы на высоте 2 метра над поверхностью земли (градусы Цельсия)',
    RRR = 'Количество выпавших осадков (миллиметры)',
    tR = 'Период времени, за который накоплено указанное количество осадков (часы)',
    sss = 'Высота снежного покрова (см)'
}

export {
    RemappableMeteoHeaders,
    MeteoHeaderVariables,
    MeteoHeaderTitles,
    LOCALTIME,
    commonStrings,
    regexToExtractNumbers,
};
