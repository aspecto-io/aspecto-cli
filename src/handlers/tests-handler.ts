import 'colors';
import { TestsOptions, RouteTestEntry, AssertionResponse } from '../types';
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
import { test } from '..';

const aggregateTestsByRoute = (assertionResults: any[]): AssertionResponse[] => {
    const byRouteMap = assertionResults.reduce((map, assertionResult) => {
        if (!(assertionResult.route in map)) {
            map[assertionResult.route] = {
                route: assertionResult.route,
                success: true,
                assertions: [],
            } as AssertionResponse;
        }
        const assertionResponse: AssertionResponse = map[assertionResult.route];
        assertionResponse.assertions.push(assertionResult);
        assertionResponse.success = assertionResponse.success && assertionResult.success;
        return map;
    }, {});
    return Object.values(byRouteMap);
};

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
    let tests: RouteTestEntry[];
    cli.action.start('Generating tests from Aspecto server');

    try {
        tests = await fetchTests(options.package!);
    } catch (err) {
        handleError('Failed generating tests', err.stack);
    }

    cli.action.stop(`Generated a total of ${tests.length} tests 🎉`);
    if (test.length === 0) {
        logger.info('Not enough data, goodbye!'.bold);
        return;
    }

    const fetchEndTime = Date.now();

    printers.printUsedVersion(tests);

    //  ==== RUN TESTS ===
    cli.action.start(`Running Aspecto API Tests`.bold as any);
    const testsResponse = await Promise.all(tests.map(routeTestRunner.run));
    cli.action.stop(`Test execution completed, now asserting.`);
    const runEndTime = Date.now();

    // === ASSERT TESTS ===
    cli.action.start(`Asserting tests..`.bold as any);
    const assertion = await assert(testsResponse, fetchEndTime - startTime, runEndTime - fetchEndTime);
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
