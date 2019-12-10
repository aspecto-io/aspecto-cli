import { AxiosResponse } from 'axios';
import { RouteDetails, RequestDetailsPayload, VariableAnalysis } from '../../types';
import { validate, getSchema } from './validators';

const assertVariable = (name: string, expectedSchema: string, value: string) => {
    const isValid = validate(expectedSchema, value);
    if (!isValid) {
        throw new Error(
            `expected ${name} to be of type ${expectedSchema}, actual type is ${getSchema(value)} (${value})`
        );
    }
};

const assertObject = (type: string, expected: RequestDetailsPayload, actual: any) => {
    if (!expected && actual) throw new Error(`Expected to get an empty response, got ${actual}`);
    if (!expected) return;

    const isFlat = typeof Object.values(expected)[0] !== 'object';
    if (isFlat) {
        assertVariable(expected.name as string, expected.valueType as string, actual);
        return;
    }
    const errors: string[] = [];
    Object.entries(expected).forEach(([key, analysis]: [string, VariableAnalysis]) => {
        try {
            assertVariable(key, analysis.valueType, actual[key]);
        } catch (err) {
            errors.push(`${type} Schema Mismatch: `.italic + `${err.message}`);
        }
    });
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
};

export default (routeDetails: RouteDetails, res: AxiosResponse) => {
    if (routeDetails.statusCode !== res.status) {
        throw new Error(`StatusCode does not match, expected ${routeDetails.statusCode}, got ${res.status}`);
    }

    if (routeDetails.statusCode === 200) {
        assertObject('Body', routeDetails.responseBody, res.data);
        assertObject('Headers', routeDetails.responseHeaders, res.headers);
    }
};
