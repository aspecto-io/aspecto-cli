import { AspectoTest, TestAndCliMetadata } from '../types';

const applyFilterOnSingleTest = (
    test: AspectoTest,
    allowedVerbs: string[],
    allowedStatusCodes: number[],
    env: string
): TestAndCliMetadata => {
    const filterReasons = [];
    if (allowedVerbs && !allowedVerbs.includes(test.verb)) {
        filterReasons.push(`verb '${test.verb}' does not meet the provided filters '${allowedVerbs.join(',')}'`);
    }

    if (allowedStatusCodes && !allowedStatusCodes.includes(test.statusCode)) {
        filterReasons.push(
            `status code '${test.statusCode}' does not meet the provided filters '${allowedStatusCodes.join(',')}'`
        );
    }

    test.envValues = test.envValues.filter((envValue) => envValue.env === env);
    if (test.envValues.length == 0) {
        filterReasons.push(`no data available from env '${env}'`);
    }

    return {
        test,
        filterResult: {
            pass: filterReasons.length == 0,
            appliedFilters: filterReasons,
        },
    };
};

export const filterTests = (tests: AspectoTest[]): TestAndCliMetadata[] => {
    const allowedVerbs = global.aspectoOptions.allowMethods?.split(',');
    const allowedStatusCodes = global.aspectoOptions.allowCodes?.split(',').map((s) => (s as unknown) as number);
    const env = global.aspectoOptions.env;

    return tests.map((t) => applyFilterOnSingleTest(t, allowedVerbs, allowedStatusCodes, env));
};
