import { AspectoTest } from '../types';
import { client } from './api-tests-client';

export const fetchAllTests = async (packageName: string): Promise<AspectoTest[]> => {
    // assuming that each suite name is it's package name.
    // this is likely to change in the future
    const response = await client.get(`/suites?name=${packageName}`);
    return response.data.tests as AspectoTest[];
};
