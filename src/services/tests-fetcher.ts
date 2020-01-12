import { Route, RouteDetails, RouteTestEntry } from '../types';
import { client } from './api-tests-client';

const fetch = async (packageName: string): Promise<RouteTestEntry[]> => {
    const routes = (await client.get<Route[]>(`/routes?package=${packageName}`, { timeout: 8000 })).data
        .filter((x: Route) => x.route && x.type !== 'outgoing')
        .map((x: Route) => x.route);

    const query: string[] = [`&package=${packageName}`];
    if (global.aspectoOptions.allowMethods) query.push(`&verb=${global.aspectoOptions.allowMethods}`);
    if (global.aspectoOptions.allowCodes) query.push(`&statusCode=${global.aspectoOptions.allowCodes}`);
    if (global.aspectoOptions.env) query.push(`&env=${global.aspectoOptions.env}`);

    const getRouteDetails = (routeName: string) =>
        client.get<RouteDetails[]>(`/route?route=${encodeURIComponent(routeName)}${query.join('')}`, {
            timeout: 30000,
        });

    const routeDetailsArray: RouteDetails[][] = (await Promise.all(routes.map(getRouteDetails))).map((res) => res.data);

    const response: RouteTestEntry[] = [];
    routes.forEach((route: string, index: number) =>
        response.push({
            route,
            routeDetails: routeDetailsArray[index],
        })
    );

    return response;
};

export default fetch;
