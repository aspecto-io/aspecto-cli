import { AssertionResponse } from '../types';

export const aggregateTestsByRoute = (assertionResults: any[]): AssertionResponse[] => {
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
