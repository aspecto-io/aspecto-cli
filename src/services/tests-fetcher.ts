import { RouteTestEntry } from '../types';
import { client } from './api-tests-client';

const fetch = async (packageName: string): Promise<RouteTestEntry[]> => {
    const query: string[] = [`latestVersions=1`];
    if (global.aspectoOptions.allowMethods) query.push(`verb=${global.aspectoOptions.allowMethods}`);
    if (global.aspectoOptions.allowCodes) query.push(`statusCode=${global.aspectoOptions.allowCodes}`);
    if (global.aspectoOptions.env) query.push(`env=${global.aspectoOptions.env}`);

    const response = await client.get(`/package/${packageName}?${query.join('&')}`);
    return response.data;
};

export default fetch;
