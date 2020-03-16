import { AspectoTest } from '../types';
import { logger } from '../services/logger';

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

const logFiltered = (origTests: AspectoTest[], filteredTests: AspectoTest[], filterData: any) => {
    if (origTests.length == filteredTests.length) return;

    const testsFiltered = origTests.length - filteredTests.length;
    logger.info(`${testsFiltered}\\${origTests.length} tests were filtered due to command line filter options`);

    if (global.verbose) {
        if (filterData.verb.filteredCount > 0) {
            logger.info(`${filterData.verb.filteredCount} tests did not match method '${filterData.verb.filter}'`);
        }
        if (filterData.statusCode.filteredCount > 0) {
            logger.info(
                `${filterData.statusCode.filteredCount} tests did not match status code '${filterData.statusCode.filter}'`
            );
        }
        if (filterData.env.filteredCount > 0) {
            logger.info(
                `${filterData.env.filteredCount} tests has no data from environment '${filterData.env.filter}'`
            );
        }
    }
};

export const filterTests = (tests: AspectoTest[]): AspectoTest[] => {
    let filterData = {
        verb: { filter: global.aspectoOptions.allowMethods },
        statusCode: { filter: (global.aspectoOptions.allowCodes as unknown) as number },
        env: { filter: global.aspectoOptions.env },
    };

    const [filtered, filterDataWithCount] = applyFilter(tests, filterData);
    logFiltered(tests, filtered, filterDataWithCount);

    return filtered;
};
