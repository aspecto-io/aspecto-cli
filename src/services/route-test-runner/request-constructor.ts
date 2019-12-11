import { RouteDetails, VariableAnalysis, RequestDetailsPayload } from '../../types';
import axios, { AxiosRequestConfig } from 'axios';

const constructPayload = (details?: RequestDetailsPayload): any => {
    if (!details) return {};

    // Leaf nodes
    if ((details as VariableAnalysis).example) return (details as VariableAnalysis).example;

    if (Array.isArray(details)) {
        const payloadArray: any[] = [];
        details.forEach((e: RequestDetailsPayload) => {
            payloadArray.push(constructPayload(e));
        });
        return payloadArray;
    }

    const payload: any = {};
    Object.entries(details).forEach((e) => {
        payload[e[0]] = constructPayload(e[1]);
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
    const config: AxiosRequestConfig = {
        method: routeDetails.verb,
        baseURL: global.url,
        url: `${routeDetails.url}${constructQuery(routeDetails.queryParams)}`,
        data: constructPayload(routeDetails.requestBody),
        headers: constructPayload(routeDetails.requestHeaders),
        validateStatus: () => true,
        timeout: 4000,
    };

    return () => axios.request(config);
};
