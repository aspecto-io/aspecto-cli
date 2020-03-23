import { AspectoTest, TestAndCliMetadata } from '../types';
import { logFilteredTests } from '../printers/tests-filter-printer';

const applyFilterOnSingleTest = (test: AspectoTest, filters: any): TestAndCliMetadata => {
    const filterReasons = [];
    if (filters.verb.filter && test.verb !== filters.verb.filter) {
        filterReasons.push(`verb is not '${filters.verb.filter}'`);
    }

    if (filters.statusCode.filter && test.statusCode != filters.statusCode.filter) {
        filterReasons.push(`status code is not '${filters.statusCode.filter}'`);
    }

    test.envValues = test.envValues.filter((envValue) => envValue.env === filters.env.filter);
    if (test.envValues.length == 0) {
        filterReasons.push(`no data available from env '${filters.env.filter}'`);
    }

    return {
        test,
        filterResult: {
            pass: filterReasons.length == 0,
            appliedFilters: filterReasons,
        },
    };
};

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

export const filterTests = (tests: AspectoTest[]): TestAndCliMetadata[] => {
    const filterData = {
        verb: { filter: global.aspectoOptions.allowMethods },
        statusCode: { filter: (global.aspectoOptions.allowCodes as unknown) as number },
        env: { filter: global.aspectoOptions.env },
    };

    return tests.map((t) => applyFilterOnSingleTest(t, filterData));

    const [filtered, filterDataWithCount] = applyFilter(tests, filterData);
    logFilteredTests(tests, filtered, filterDataWithCount);

    return filtered;
};
