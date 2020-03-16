import { AspectoTest } from '../types';
import { logger } from '../services/logger';

export const logFilteredTests = (origTests: AspectoTest[], filteredTests: AspectoTest[], filterData: any) => {
    if (origTests.length == filteredTests.length) return;

    const testsFiltered = origTests.length - filteredTests.length;
    logger.info(`Out of ${origTests.length} tests, ${testsFiltered} were filtered due to provided arguments.`);

    if (filterData.verb.filteredCount > 0) {
        logger.debug(`${filterData.verb.filteredCount} tests did not match method '${filterData.verb.filter}'`);
    }

    if (filterData.statusCode.filteredCount > 0) {
        logger.debug(
            `${filterData.statusCode.filteredCount} tests did not match status code '${filterData.statusCode.filter}'`
        );
    }

    if (filterData.env.filteredCount > 0) {
        logger.debug(`${filterData.env.filteredCount} tests had no data from environment '${filterData.env.filter}'`);
    }
};
