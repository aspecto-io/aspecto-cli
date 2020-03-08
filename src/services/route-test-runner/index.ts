import constructRequest from './request-constructor';
import axios, { AxiosRequestConfig } from 'axios';
import 'colors';
import { AspectoTest } from '../../types';

const run = async (test: AspectoTest): Promise<any> => {
    const requestConfig: AxiosRequestConfig = constructRequest(test);

    const toAssert: any = {
        testId: test._id,
        packageName: test.packageName,
        env: test.envValues[0].env,
        route: test.route,
        verb: test.verb,
        statusCode: test.statusCode,
        url: requestConfig.url,
    };

    const testStartTime = Date.now();

    try {
        const httpResponse = await axios.request(requestConfig);
        toAssert.actual = {
            body: httpResponse.data,
            headers: httpResponse.headers,
            statusCode: httpResponse.status,
            executionTimeMs: Date.now() - testStartTime,
        };
    } catch (err) {
        toAssert.actual = {
            error: err.message,
        };
    }

    return toAssert;
};

export default {
    run,
};
