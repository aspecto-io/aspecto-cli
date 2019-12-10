import { logger } from '../services/logger';
import 'colors';

export const printRunSummary = (startTime: number, endTime: number, testsResponse: any) => {
    const duration = endTime - startTime;

    const routesCount = testsResponse.length;
    const totalRoutesFailed = testsResponse.filter((res: any) => res.failCount > 0).length;
    const totalRoutesPassed = routesCount - totalRoutesFailed;

    const testsCount = testsResponse.reduce((counter: number, entry: any) => counter + entry.total, 0);
    const totalTestsFailed = testsResponse.reduce((counter: number, entry: any) => counter + entry.failCount, 0);
    const totalTestsPassed = testsCount - totalTestsFailed;

    logger.info(
        `${'\nRoutes:'.padEnd(7).bold} ${
            totalRoutesFailed > 0 ? (`${totalRoutesFailed} failed`.bold as any).brightRed + ', ' : ''
        }${(`${totalRoutesPassed} passed`.bold as any).brightGreen}, ${routesCount} total`
    );
    logger.info(
        `${'Tests:'.padEnd(7).bold} ${
            totalTestsFailed > 0 ? (`${totalTestsFailed} failed`.bold as any).brightRed + ', ' : ''
        }${(`${totalTestsPassed} passed`.bold as any).brightGreen}, ${testsCount} total`
    );
    const time = duration > 1000 ? `${duration / 1000}s` : `${duration}ms`;
    logger.info(`${'Time:'.padEnd(7).bold} ${time}`);
};

export const printRouteSummary = (results: any, failCount: number, routeName: string) => {
    const badge =
        (failCount === 0 ? '✅ ' : '❌ ') +
        ' Route '.bold +
        routeName.italic.bold +
        (failCount === 0 ? ' passed!' : ' failed:').bold;
    logger.info(badge);

    results.forEach((res: any) => {
        logger.debug(
            (res.failed ? ('  ✗ ' as any).brightRed : ('  ✓ ' as any).brightGreen) +
                `${res.testName} (${res.duration}ms)`.gray
        );
    });

    failCount > 0 && logger.newLine();

    results
        .filter((res: any) => res.failed)
        .forEach((res: any) => {
            // @ts-ignore
            logger.info(`  ● ${res.testName}`.italic.brightRed);
            res.failLog.split('\n').forEach((x: string) => logger.info(`   ${x}`));
            logger.newLine();
        });

    failCount === 0 && logger.debug('');
};
