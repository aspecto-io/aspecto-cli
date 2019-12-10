import { RouteDetails, VariableAnalysis, RequestDetailsPayload } from '../../types';
import axios from 'axios';

const constructPayload = (details?: RequestDetailsPayload): any => {
    if (!details) return {};

    const isFlat = typeof Object.values(details)[0] !== 'object';
    if (isFlat) return details.example;

    const payload: any = {};
    Object.entries(details).forEach((e) => {
        payload[e[0]] = e[1].example;
    });
    return payload;
};

const constructQuery = (queryObject?: RequestDetailsPayload): string => {
    const query: string[] = [];
    if (queryObject) {
        Object.entries(queryObject).forEach(([queryName, analysis]: [string, VariableAnalysis], i: number) => {
            query.push(i === 0 ? '?' : '&');
            query.push(`${queryName}=${encodeURIComponent(analysis.example)}`);
        });
    }
    return query.join('');
};

export default (routeDetails: RouteDetails) => {
    const config = {
        method: routeDetails.verb,
        baseURL: global.url,
        url: `${routeDetails.url}${constructQuery(routeDetails.queryParams)}`,
        data: constructPayload(routeDetails.requestBody),
        headers: constructPayload(routeDetails.requestHeaders),
        validateStatus: () => true,
    };

    return () => axios.request(config);
};
