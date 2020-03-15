import { AssertionResponse } from '../types';

export const aggregateTestsByRoute = (assertionResults: any[]): AssertionResponse[] => {
    const byRouteMap = assertionResults.reduce((map, assertionResult) => {
        const currRoute: string = assertionResult.testSnapshot.route;
        if (!(currRoute in map)) {
            map[currRoute] = {
                route: currRoute,
                success: true,
                assertions: [],
            } as AssertionResponse;
        }
        const assertionResponse: AssertionResponse = map[currRoute];
        assertionResponse.assertions.push(assertionResult);
        assertionResponse.success = assertionResponse.success && assertionResult.success;
        return map;
    }, {});
    return Object.values(byRouteMap);
};
