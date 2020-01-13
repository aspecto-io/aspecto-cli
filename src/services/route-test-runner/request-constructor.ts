import { RouteDetails, StringObject } from '../../types';
import axios, { AxiosRequestConfig } from 'axios';
import calculateTimeout from './timeout-calculator';

const constructQuery = (queryObject?: StringObject): string => {
    const query: string[] = [];
    if (queryObject) {
        Object.entries(queryObject).forEach(([queryName, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v: string) => query.push(`${queryName}=${encodeURIComponent(v)}`));
            } else query.push(`${queryName}=${encodeURIComponent(value)}`);
        });
    }
    return query.length > 0 ? '?' + query.join('&') : '';
};

export default (routeDetails: RouteDetails) => {
    const config: AxiosRequestConfig = {
        method: routeDetails.verb,
        baseURL: global.url,
        url: `${routeDetails.url}${constructQuery(routeDetails.queryParams)}`,
        data: routeDetails.requestBody,
        headers: {
            ...routeDetails.requestHeaders,
            'X-Origin': 'Aspecto-CLI',
        },
        validateStatus: () => true,
        timeout: calculateTimeout(routeDetails),
        // timeout: 10000,
    };

    return () => axios.request(config);
};
