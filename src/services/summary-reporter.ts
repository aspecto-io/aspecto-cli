import { RouteTestSuiteSummary } from '../types';

export default (startTime: number, endTime: number, suiteSummaries: RouteTestSuiteSummary[]) => {
    const testsFailCount = suiteSummaries.reduce(
        (counter: number, entry: RouteTestSuiteSummary) => counter + entry.failCount,
        0
    );
    const testsCount = suiteSummaries.reduce(
        (counter: number, entry: RouteTestSuiteSummary) => counter + entry.totalTestCount,
        0
    );

    const report = {
        url: global.url,
        options: global.aspectoOptions,
        startTime,
        endTime,
        suiteSummaries,
        testsCount,
        testsFailCount,
    };
    // TODO: report to remote service
};
