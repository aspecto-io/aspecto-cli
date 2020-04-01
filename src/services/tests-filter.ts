import { TestAndCliMetadata, AspectoTest } from '../models';

const applyFilterOnSingleTest = (
    test: AspectoTest,
    allowedVerbs: string[],
    allowedStatusCodes: number[],
    env: string
): TestAndCliMetadata => {
    const filterReasons = [];
    if (allowedVerbs && !allowedVerbs.includes(test.verb)) {
        filterReasons.push(`Method '${test.verb}' does not meet the allow-methods filter '${allowedVerbs.join(',')}'`);
    }

    if (allowedStatusCodes && !allowedStatusCodes.includes(test.statusCode)) {
        filterReasons.push(
            `Status Code '${test.statusCode}' does not meet the allow-codes filter '${allowedStatusCodes.join(',')}'`
        );
    }

    test.envValues = test.envValues.filter((envValue) => envValue.env === env);
    if (test.envValues.length == 0) {
        filterReasons.push(`No data available from env '${env}'`);
    }

    return {
        test,
        filters: filterReasons,
    };
};

export const filterTests = (tests: AspectoTest[]): TestAndCliMetadata[] => {
    const allowedVerbs = global.aspectoOptions.allowMethods?.toUpperCase()?.split(',');
    const allowedStatusCodes = global.aspectoOptions.allowCodes?.split(',').map((s) => (s as unknown) as number);
    const env = global.aspectoOptions.env;

    return tests.map((t) => applyFilterOnSingleTest(t, allowedVerbs, allowedStatusCodes, env));
};
