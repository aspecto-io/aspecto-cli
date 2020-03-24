import { RouteAssertionResults } from '../types';

export const aggregateTestsByRoute = (assertionResponses: any[]): RouteAssertionResults[] => {
    const byRouteMap = assertionResponses.reduce((map, assertionResponse) => {
        const currRoute: string = assertionResponse.testSnapshot.route;
        if (!(currRoute in map)) {
            map[currRoute] = {
                route: currRoute,
                assertions: [],
                skippedCount: 0,
                failedCount: 0,
                passedCount: 0,
            } as RouteAssertionResults;
        }
        const routeResult: RouteAssertionResults = map[currRoute];
        const skipped = assertionResponse.assertionResult.skipped;
        if (!skipped) {
            const currentTestPassed = assertionResponse.assertionResult.success;
            if (currentTestPassed) {
                routeResult.passedCount++;
            } else {
                routeResult.failedCount++;
            }
        } else {
            routeResult.skippedCount++;
        }
        routeResult.assertions.push(assertionResponse);
        return map;
    }, {});
    return Object.values(byRouteMap);
};
