import 'colors';
import { TestsOptions, RouteTestEntry } from '../types';
import { cli } from 'cli-ux';
import { logger } from '../services/logger';
import fetchTests from '../services/tests-fetcher';
import handleError from '../utils/error-handler';
import routeTestRunner from '../services/route-test-runner';
import printer from '../printers';
import initializeConfig from '../services/init-config';
import { assert } from '../services/assert';

const handleTestAction = async (url: string, options: TestsOptions) => {
    //  ==== CONFIGURATION ===
    const startTime = Date.now();
    initializeConfig(url, options);
    logger.info('\n↗️  Aspecto Test Runner\n'.green.bold);
    printer.printParams();

    //  ==== FETCH TESTS ===
    let tests: RouteTestEntry[];
    cli.action.start('Generating tests from Aspecto server');

    try {
        tests = (await fetchTests(options.package!, options.token)).filter((x) => x.routeDetails.length > 0);
    } catch (err) {
        handleError('Failed generating tests', err.stack);
    }

    const testsCount = tests.reduce((counter: number, entry: RouteTestEntry) => counter + entry.routeDetails.length, 0);
    cli.action.stop(`Generated a total of ${testsCount} tests 🙌🏼`);
    const fetchEndTime = Date.now();

    if (testsCount === 0) {
        logger.info('Not enough data, goodbye!'.bold);
        return;
    }

    //  ==== RUN TESTS ===
    cli.action.start(`Running Aspecto API Tests`.bold as any);
    const testsResponse = await Promise.all(tests.map(routeTestRunner.run));
    cli.action.stop(`Test execution completed, now asserting.`);
    const runEndTime = Date.now();

    // === ASSERT TESTS ===
    cli.action.start(`Asserting tests..`.bold as any);
    const assertion = await assert(testsResponse, fetchEndTime - startTime, runEndTime - fetchEndTime);
    cli.action.stop(`Done.\n`.bold as any);
    printer.printAssertionResults(assertion, startTime);

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
