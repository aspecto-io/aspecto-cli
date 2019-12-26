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

const isLeaf = (myVar: any) =>
    typeof myVar === 'object' &&
    myVar !== null &&
    (myVar as any).hasOwnProperty('example') &&
    (myVar as any).hasOwnProperty('valueType');

const assertObject = (type: string, expected: RequestDetailsPayload, actual: any, errors: string[]) => {
    if (!expected && actual) throw new Error(`Expected to get an empty response, got ${actual}`);
    if (!expected) return;

    if (isLeaf(expected)) {
        try {
            assertVariable(
                (expected as VariableAnalysis).name as string,
                (expected as VariableAnalysis).valueType as string,
                actual
            );
        } catch (err) {
            errors.push(`${type} Schema Mismatch: `.italic + `${err.message}`);
        }
        return;
    }

    if (Array.isArray(expected)) {
        actual.forEach((val: RequestDetailsPayload, i: number) => {
            if (expected[i] !== undefined) {
                assertObject(type, expected[i], val, errors);
            }
        });
        return;
    }

    Object.entries(expected).forEach(([key, analysis]: [string, VariableAnalysis]) => {
        assertObject(type, analysis, actual[key], errors);
    });
};

export default (routeDetails: RouteDetails, res: AxiosResponse) => {
    // Since 304 is cached, we won't fail a test.
    if (routeDetails.statusCode !== res.status && routeDetails.statusCode !== 304) {
        throw new Error(`StatusCode does not match, expected ${routeDetails.statusCode}, got ${res.status}`);
    }
    const errors: string[] = [];

    if (routeDetails.statusCode === 200) {
        if (
            routeDetails.responseHeaders['content-type'].example.includes('json') &&
            (routeDetails.responseBody as any).body
        ) {
            assertObject('Body', (routeDetails.responseBody as any).body, res.data, errors);
        } else {
            assertObject('Body', routeDetails.responseBody, res.data, errors);
        }
        assertObject('Headers', routeDetails.responseHeaders, res.headers, errors);
    }

    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
};
