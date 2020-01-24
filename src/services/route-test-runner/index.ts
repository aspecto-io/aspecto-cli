import { RouteTestEntry, RouteDetails } from '../../types';
import constructRequest from './request-constructor';
import 'colors';

interface RunResponse {
    route: string;
    results: any[];
}

const run = async (entry: RouteTestEntry): Promise<RunResponse> => {
    if (entry.routeDetails.length === 0) return;
    const responses: any[] = [];
    await Promise.all(
        entry.routeDetails.map(async (details: RouteDetails) => {
            const testStartTime = Date.now();
            const request = constructRequest(details);
            const toAssert: any = {
                testId: details._id,
                packageName: details.packageName,
                env: details.env,
                gitHash: details.gitHash,
                route: details.route,
                verb: details.verb,
                url: details.url,
                expected: {
                    schema: details.responseBodySchema,
                    schemaHash: details.schemaHash,
                    metadata: details.responseMetadata.responseMetadata,
                    headers: details.responseHeaders,
                    statusCode: details.statusCode,
                    executionTime: details.executionTime,
                },
            };

            try {
                const response = await request();
                toAssert.actual = {
                    body: response.data,
                    headers: response.headers,
                    statusCode: response.status,
                    executionTime: Date.now() - testStartTime,
                };
            } catch (err) {
                toAssert.actual = {
                    error: err.message,
                };
            }
            responses.push(toAssert);
        })
    );

    return {
        route: entry.route,
        results: responses,
    };
};

export default {
    run,
};
