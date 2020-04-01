import { logger } from '../services/logger';
import { RouteAssertionResults, TestRunResultWithAssertion } from '../models';
import 'colors';

const printRunSummary = (
    startTime: number,
    routeFailedCount: number,
    routeSkippedCount: number,
    routePassCount: number,
    testFailedCount: number,
    testSkippedCount: number,
    testPassCount: number
) => {
    const duration = Date.now() - startTime;

    const routeFailedText = routeFailedCount > 0 ? (`${routeFailedCount} failed, `.bold as any).brightRed : '';
    const routeSkippedText = routeSkippedCount > 0 ? (`${routeSkippedCount} skipped, `.bold as any).yellow : '';
    const routePassedText = `${(`${routePassCount} passed`.bold as any).brightGreen}, `;
    const routeTotalText = `${routePassCount + routeFailedCount + routeSkippedCount} total`;
    logger.info(`${'Routes:'.padEnd(7).bold} ${routeFailedText}${routeSkippedText}${routePassedText}${routeTotalText}`);

    const testFailedText = testFailedCount > 0 ? (`${testFailedCount} failed, `.bold as any).brightRed : '';
    const testSkippedText = testSkippedCount > 0 ? (`${testSkippedCount} skipped, `.bold as any).yellow : '';
    const testPassedText = `${(`${testPassCount} passed`.bold as any).brightGreen}, `;
    const testTotalText = `${testPassCount + testFailedCount + testSkippedCount} total`;
    logger.info(`${'Tests:'.padEnd(7).bold} ${testFailedText}${testSkippedText}${testPassedText}${testTotalText}`);

    const time = duration > 1000 ? `${duration / 1000}s` : `${duration}ms`;
    logger.info(`${'Time:'.padEnd(7).bold} ${time}`);
};

const testNameForPrinting = (test: TestRunResultWithAssertion): string => {
    return `${test.testSnapshot.description}: ${test.testSnapshot.verb} ${test.actualRequest?.url ??
        test.testSnapshot.route} - ${test.testSnapshot.statusCode} (env: ${test.env})`;
};

export const printAssertionResults = (results: RouteAssertionResults[], startTime: number) => {
    let routePassCount = 0;
    let routeSkippedCount = 0;
    let routeFailedCount = 0;

    let testPassCount = 0;
    let testSkippedCount = 0;
    let testFailedCount = 0;

    results.forEach((suiteResult) => {
        let badge: string;
        if (suiteResult.failedCount > 0) {
            badge = '❌ ' + ' Route '.bold + suiteResult.route.italic.bold + ' failed!'.bold;
            routeFailedCount++;
        } else if (suiteResult.passedCount > 0) {
            badge = '✅ ' + ' Route '.bold + suiteResult.route.italic.bold + ' passed!'.bold;
            routePassCount++;
        } else {
            badge = '🟡 ' + ' Route '.bold + suiteResult.route.italic.bold + ' skipped all tests'.bold;
            routeSkippedCount++;
        }
        logger.info(badge);

        testPassCount += suiteResult.passedCount;
        testSkippedCount += suiteResult.skippedCount;
        testFailedCount += suiteResult.failedCount;

        suiteResult.assertions.forEach((routeAssert) => {
            const assertionResult = routeAssert.assertionResult;

            const testName = testNameForPrinting(routeAssert);
            if (assertionResult.skipped) {
                logger.debug(('  • ' as any).yellow + testName.gray);
            } else if (assertionResult.success) {
                logger.debug(('  ✓ ' as any).brightGreen + testName.gray);
            } else {
                logger.debug(('  ✗ ' as any).brightRed + testName.gray);
            }
        });

        suiteResult.failedCount > 0 && logger.newLine();

        suiteResult.assertions
            .filter((r) => !r.assertionResult.skipped && !r.assertionResult.success)
            .forEach((routeAssert) => {
                const testName = testNameForPrinting(routeAssert);
                // @ts-ignore
                logger.info(`  ● ${testName}`.italic.brightRed);
                routeAssert.assertionResult.log.split('\n').forEach((x: string) => logger.info(`   ${x}`));
                logger.newLine();
            });

        if (suiteResult.failedCount == 0) logger.debug('');
    });
    printRunSummary(
        startTime,
        routeFailedCount,
        routeSkippedCount,
        routePassCount,
        testFailedCount,
        testSkippedCount,
        testPassCount
    );
};
