import { client } from './api-tests-client';
import { RouteAssertionResults, TestRunResult } from '../types';
import * as os from 'os';
import { logger } from './logger';

export const assert = async (
    testsRunResults: TestRunResult[],
    fetchTestsDuration: number,
    runTestsDuration: number
) => {
    try {
        const res = await client.post<{ summaryId: string; assertResults: RouteAssertionResults[] }>('/assert', {
            options: global.aspectoOptions,
            url: global.url,
            hostname: os.hostname(),
            fetchTestsDuration,
            runTestsDuration,
            runResult: testsRunResults,
        });

        return res.data;
    } catch (err) {
        logger.error(`failed to assert tests run results: ${err}`);
        throw err;
    }
};
