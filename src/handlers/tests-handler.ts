import 'colors';
import { TestsOptions, AspectoTest, TestRunResult } from '../types';
import { cli } from 'cli-ux';
import { logger } from '../services/logger';
import fetchTests from '../services/tests-fetcher';
import handleError from '../utils/error-handler';
import routeTestRunner from '../services/route-test-runner';
import printer from '../printers';
import initializeConfig from '../services/init-config';
import { assert } from '../services/assert';
import checkUrl from '../services/url-checker';
import printers from '../printers';
import { aggregateTestsByRoute } from '../services/tests-aggregation';

const handleTestAction = async (url: string, options: TestsOptions) => {
    //  ==== CONFIGURATION ===
    const startTime = Date.now();
    initializeConfig(url, options);
    logger.info('\n↗️  Aspecto Test Runner\n'.green.bold);
    printer.printParams();

    if (!(await checkUrl(url))) {
        logger.error(`URL ${url} is not reachable.`);
        return;
    }

    //  ==== FETCH TESTS ===
    let tests: AspectoTest[];
    cli.action.start('Generating tests from Aspecto server');

    try {
        tests = await fetchTests(options.package!);
    } catch (err) {
        handleError('Failed generating tests', err.stack);
    }

    cli.action.stop(`Generated a total of ${tests.length} tests 🎉`);
    if (tests.length === 0) {
        logger.info('Not tests to run, goodbye!'.bold);
        return;
    }

    const fetchEndTime = Date.now();

    printers.printUsedVersion(tests);

    //  ==== RUN TESTS ===
    cli.action.start(`Running Aspecto API Tests`.bold as any);
    const testsResponses: TestRunResult[] = await Promise.all(tests.map(routeTestRunner.run));
    cli.action.stop(`Test execution completed, now asserting.`);
    const runEndTime = Date.now();

    // === ASSERT TESTS ===
    cli.action.start(`Asserting tests..`.bold as any);
    const assertion = await assert(testsResponses, fetchEndTime - startTime, runEndTime - fetchEndTime);
    cli.action.stop(`Done.\n`.bold as any);
    const assertionResultsByRoute = aggregateTestsByRoute(assertion);
    printer.printAssertionResults(assertionResultsByRoute, startTime);

    const failed = assertion.some((x) => !x.success);

    if (failed && options.allowFail) {
        logger.newLine();
        logger.info(` Run failed, exiting with 1 `.bgRed.bold);
        process.exit(1);
    } else if (failed) {
        logger.newLine();
        logger.debug(`Allow fail is off, terminating with 0`.gray);
    }
    process.exit(0);
};

export default handleTestAction;
