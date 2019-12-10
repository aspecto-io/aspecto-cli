import { RouteTestEntry, RouteDetails, RouteTestSuiteSummary } from '../../types';
import printer from '../../printers';
import constructRequest from './request-constructor';
import assert from './asserter';
import 'colors';

const run = async (entry: RouteTestEntry): Promise<RouteTestSuiteSummary> => {
    let total = entry.routeDetails.length;

    const results = await Promise.all(
        entry.routeDetails.map(async (details: RouteDetails, i: number) => {
            const testStartTime = Date.now();
            const request = constructRequest(details);

            let failLog = '';
            let failed = false;
            try {
                const response = await request();
                assert(details, response);
            } catch (err) {
                failLog = err.message;
                failed = true;
            }

            const testName = `${details.verb} ${details.url} - ${details.statusCode} (env: ${details.env})`;

            const duration = Date.now() - testStartTime;
            return {
                failed,
                testName,
                failLog,
                duration,
                id: details._id,
            };
        })
    );

    const failCount = results.filter((x) => x.failed).length;
    const passCount = total - failCount;

    printer.printRouteSummary(results, failCount, entry.route);

    return {
        totalTestCount: total,
        failCount,
        passCount,
        routeName: entry.route,
        results,
    };
};

export default {
    run,
};
