import { client } from './api-tests-client';
import { AssertionResponse } from '../types';

export const assert = async (payload: any, fetchTestsDuration: number, runTestsDuration: number) => {
    const res = await client.post<AssertionResponse[]>('/assert', {
        options: global.aspectoOptions,
        url: global.url,
        fetchTestsDuration,
        runTestsDuration,
        runResult: payload,
    });

    return res.data;
};
