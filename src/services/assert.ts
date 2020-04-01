import { client } from './api-tests-client';
import { TestRunResult, TestRunResultWithAssertion } from '../models';
import * as os from 'os';
import handleError from '../utils/error-handler';

const skipSummaryPersist = process.env.SKIP_SUMMARY_PERSIST === 'true';

interface AssertResponse {
    summaryId: string;
    assertResults: TestRunResultWithAssertion[];
}

export const assert = async (
    testsRunResults: TestRunResult[],
    fetchTestsDuration: number,
    runTestsDuration: number
): Promise<AssertResponse> => {
    try {
        const res = await client.post<AssertResponse>('/assert', {
            options: global.aspectoOptions,
            url: global.url,
            hostname: os.hostname(),
            fetchTestsDuration,
            runTestsDuration,
            runResult: testsRunResults,
            skipSummaryPersist,
        });

        return res.data;
    } catch (err) {
        handleError(`Something went wrong while trying to assert test run results: ${err}`);
    }
};
