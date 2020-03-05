import { StringObject } from '../../types';
import { AxiosRequestConfig } from 'axios';
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

export default (test: any): AxiosRequestConfig => {
    const envValues = test.envValues[0].values;

    const config: AxiosRequestConfig = {
        method: test.verb,
        baseURL: global.url,
        url: `${envValues.url}${constructQuery(envValues.queryParams)}`,
        data: envValues.requestBody,
        headers: {
            ...envValues.requestHeaders,
            'X-Origin': 'Aspecto-CLI',
        },
        validateStatus: () => true,
        timeout: calculateTimeout(test),
        // timeout: 10000,
    };

    return config;
};
