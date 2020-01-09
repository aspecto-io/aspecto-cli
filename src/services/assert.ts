import axios from 'axios';
import { AssertionResponse } from '../types';

const client = axios.create({ baseURL: 'http://localhost:8089/api/v1/test' });

export const assert = async (payload: any, fetchTestsDuration: number, runTestsDuration: number) => {
    const headers = { authorization: `Basic ${global.aspectoOptions.token}` };
    const res = await client.post<AssertionResponse[]>(
        '/assert',
        {
            options: global.aspectoOptions,
            url: global.url,
            fetchTestsDuration,
            runTestsDuration,
            runResult: payload,
        },
        { headers }
    );

    return res.data;
};
