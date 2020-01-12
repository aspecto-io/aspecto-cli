import { logger } from '../services/logger';
import { AssertionResponse } from '../types';
import 'colors';

const printRunSummary = (
    startTime: number,
    suitesCount: number,
    suitesPassCount: number,
    testCount: number,
    testPassCount: number
) => {
    const duration = Date.now() - startTime;
    const suitesFailCount = suitesCount - suitesPassCount;
    const testsFailCount = testCount - testPassCount;

    logger.info(
        `${'\nRoutes:'.padEnd(7).bold} ${
            suitesFailCount > 0 ? (`${suitesFailCount} failed`.bold as any).brightRed + ', ' : ''
        }${(`${suitesPassCount} passed`.bold as any).brightGreen}, ${suitesCount} total`
    );
    logger.info(
        `${'Tests:'.padEnd(7).bold} ${
            testsFailCount > 0 ? (`${testsFailCount} failed`.bold as any).brightRed + ', ' : ''
        }${(`${testPassCount} passed`.bold as any).brightGreen}, ${testCount} total`
    );
    const time = duration > 1000 ? `${duration / 1000}s` : `${duration}ms`;
    logger.info(`${'Time:'.padEnd(7).bold} ${time}`);
};

export const printAssertionResults = (results: AssertionResponse[], startTime: number) => {
    const suitesCount = results.length;
    let suitesPassCount = 0;

    let testCount = 0;
    let testPassCount = 0;

    results.forEach((suiteResult) => {
        if (suiteResult.success) suitesPassCount++;

        const badge =
            (suiteResult.success ? '✅ ' : '❌ ') +
            ' Route '.bold +
            suiteResult.route.italic.bold +
            (suiteResult.success ? ' passed!' : ' failed:').bold;
        logger.info(badge);

        suiteResult.assertions.forEach((routeAssert) => {
            testCount++;
            if (routeAssert.success) testPassCount++;

            const testName = `${routeAssert.verb} ${routeAssert.url} - ${routeAssert.statusCode} (env: ${routeAssert.env})`;
            logger.debug(
                (!routeAssert.success ? ('  ✗ ' as any).brightRed : ('  ✓ ' as any).brightGreen) + testName.gray
            );
        });

        !suiteResult.success && logger.newLine();

        suiteResult.assertions
            .filter((r) => !r.success)
            .forEach((routeAssert) => {
                const testName = `${routeAssert.verb} ${routeAssert.url} - ${routeAssert.statusCode} (env: ${routeAssert.env})`;
                // @ts-ignore
                logger.info(`  ● ${testName}`.italic.brightRed);
                routeAssert.log.split('\n').forEach((x: string) => logger.info(`   ${x}`));
                logger.newLine();
            });
        if (suiteResult.success) logger.debug('');
    });
    printRunSummary(startTime, suitesCount, suitesPassCount, testCount, testPassCount);
};
