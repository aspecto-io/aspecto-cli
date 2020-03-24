import constructRequest from './request-constructor';
import axios, { AxiosRequestConfig } from 'axios';
import 'colors';
import { TestRunResult, TestAndCliMetadata, AspectoTest } from '../../types';
import { logger } from '../logger';
import { extractValuesFromResponse } from './response-extraction';

const run = async (testWithMetadata: TestAndCliMetadata, testParams: any): Promise<TestRunResult> => {
    const test: AspectoTest = testWithMetadata.test;
    const toAssert: TestRunResult = {
        testId: test._id,
        env: test.envValues[0]?.env,
        testSnapshot: {
            packageName: test.packageName,
            description: test.description,
            route: test.route,
            statusCode: test.statusCode,
            verb: test.verb,
            responseBodySchemaHash: test.responseBodySchemaHash,
        },
        actualResponse: {},
    };

    if (testWithMetadata.filters.length > 0) {
        toAssert.actualResponse = {
            filteredReasons: testWithMetadata.filters,
        };
        return toAssert;
    }

    try {
        const requestConfig: AxiosRequestConfig = constructRequest(test, testParams);

        toAssert.actualRequest = {
            url: requestConfig.url,
            baseURL: requestConfig.baseURL,
            queryParams: requestConfig.params,
            headers: requestConfig.headers,
            body: requestConfig.data,
            verb: requestConfig.method,
        };

        const testStartTime = Date.now();

        const httpResponse = await axios.request(requestConfig);
        toAssert.actualResponse = {
            body: httpResponse.data,
            headers: httpResponse.headers,
            statusCode: httpResponse.status,
            executionTimeMs: Date.now() - testStartTime,
        };
        extractValuesFromResponse(test, httpResponse);
    } catch (err) {
        toAssert.actualResponse = {
            error: err.message,
        };
    }

    return toAssert;
};

export default {
    run,
};
