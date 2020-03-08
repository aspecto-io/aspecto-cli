import { AspectoTest } from '../types';
import { client } from './api-tests-client';

const fetch = async (packageName: string): Promise<AspectoTest[]> => {
    const query: string[] = [`packageName=${packageName}`];
    if (global.aspectoOptions.allowMethods) query.push(`verb=${global.aspectoOptions.allowMethods}`);
    if (global.aspectoOptions.allowCodes) query.push(`statusCode=${global.aspectoOptions.allowCodes}`);
    if (global.aspectoOptions.env) query.push(`env=${global.aspectoOptions.env}`);
    if (global.aspectoOptions.gitHash) query.push(`gitHash=${global.aspectoOptions.gitHash}`);

    const response = await client.get(`/approved?${query.join('&')}`);
    return response.data as AspectoTest[];
};

export default fetch;
