import { AspectoTest } from '../types';
import { logFilteredTests } from '../printers/tests-filter-printer';

const applyFilter = (tests: AspectoTest[], filterData: any): [AspectoTest[], any] => {
    const filterDataWithCount = { ...filterData };
    for (let k in filterDataWithCount) {
        filterDataWithCount[k].filteredCount = 0;
    }

    const filtered = tests.filter((test) => {
        let take = true;

        if (filterData.verb.filter && test.verb !== filterData.verb.filter) {
            take = false;
            filterDataWithCount.verb.filteredCount++;
        }

        if (filterData.statusCode.filter && test.statusCode != filterData.statusCode.filter) {
            take = false;
            filterDataWithCount.statusCode.filteredCount++;
        }

        test.envValues = test.envValues.filter((envValue) => envValue.env === filterData.env.filter);
        if (test.envValues.length == 0) {
            take = false;
            filterDataWithCount.env.filteredCount++;
        }

        return take;
    });

    return [filtered, filterDataWithCount];
};

export const filterTests = (tests: AspectoTest[]): AspectoTest[] => {
    const filterData = {
        verb: { filter: global.aspectoOptions.allowMethods },
        statusCode: { filter: (global.aspectoOptions.allowCodes as unknown) as number },
        env: { filter: global.aspectoOptions.env },
    };

    const [filtered, filterDataWithCount] = applyFilter(tests, filterData);
    logFilteredTests(tests, filtered, filterDataWithCount);

    return filtered;
};
