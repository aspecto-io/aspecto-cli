import 'colors';
import { TestsOptions, RouteTestEntry } from '../types';
import { cli } from 'cli-ux';
import packageNameRetriever from '../utils/package-name-retriever';
import { logger } from '../services/logger';
import fetchTests from '../services/tests-fetcher';
import handleError from '../utils/error-handler';
import routeTestRunner from '../services/route-test-runner';
import printer from '../printers';
import summaryReporter from '../services/summary-reporter';

const handleTestAction = async (url: string, options: TestsOptions) => {
    options.token = options.token || process.env.ASPECTO_TOKEN;
    options.failStrategy = options.failStrategy || 'soft';
    global.aspectoMetadata = { didSetTimeout: !!options.timeout };
    options.timeout = options.timeout || 5000;

    global.aspectoOptions = options;
    global.url = url;
    const startTime = Date.now();

    if (!options.token) {
        handleError('token was not provider and could not be retrieved from process.env.ASPECTO_TOKEN.');
    }

    if (!options.package) {
        const packageName = packageNameRetriever();
        if (!packageName) {
            handleError('serviceName was not provider and could not be retrieved from package.json.');
        }
        options.package = packageName;
    }

    logger.info('\n↗️  Aspecto Test Runner\n'.green.bold);
    printer.printParams();

    let tests;
    cli.action.start('Generating tests from Aspecto server');

    try {
        tests = (await fetchTests(options.package!, options.token)).filter((x) => x.routeDetails.length > 0);
    } catch (err) {
        handleError('Failed generating tests', err.stack);
    }

    const testsCount = tests.reduce((counter: number, entry: RouteTestEntry) => counter + entry.routeDetails.length, 0);
    cli.action.stop(`Generated a total of ${testsCount} tests 🙌🏼`);
    if (testsCount === 0) {
        logger.info('Not enough data, goodbye!'.bold);
        return;
    }

    logger.info(`\nRunning Aspecto API Tests:\n`.bold);

    const testsResponse = await Promise.all(tests.map((x) => routeTestRunner.run(x)));
    const endTime = Date.now();

    const totalRoutesFailed = testsResponse.filter((res: any) => res.failCount > 0).length;
    printer.printRunSummary(startTime, endTime, testsResponse);
    summaryReporter(startTime, endTime, testsResponse);

    if (totalRoutesFailed > 0 && options.allowFail) {
        logger.newLine();
        logger.info(` Run failed, exiting with 1 `.bgRed.bold);
        process.exit(1);
    } else if (totalRoutesFailed > 0) {
        logger.newLine();
        logger.debug(`Allow fail is off, terminating with 0`.gray);
    }
    process.exit(0);
};

export default handleTestAction;
