import constructRequest from './request-constructor';
import axios, { AxiosRequestConfig } from 'axios';
import 'colors';
import { TestRunResult, TestAndCliMetadata, AspectoTest } from '../../models';
import { extractValuesFromResponse } from './response-extraction';

const run = async (testWithMetadata: TestAndCliMetadata): Promise<TestRunResult> => {
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

    let httpResponse;
    try {
        const requestConfig: AxiosRequestConfig = constructRequest(test);

        toAssert.actualRequest = {
            url: requestConfig.url,
            baseURL: requestConfig.baseURL,
            queryParams: requestConfig.params,
            headers: requestConfig.headers,
            body: requestConfig.data,
            verb: requestConfig.method,
        };

        const testStartTime = Date.now();

        httpResponse = await axios.request(requestConfig);
        toAssert.actualResponse = {
            body: httpResponse.data,
            headers: httpResponse.headers,
            statusCode: httpResponse.status,
            executionTimeMs: Date.now() - testStartTime,
        };
    } catch (err) {
        toAssert.actualResponse = {
            error: err.message,
        };
    }

    try {
        extractValuesFromResponse(test, httpResponse);
    } catch (err) {}

    return toAssert;
};

export default {
    run,
};
