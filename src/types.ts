export interface TestsOptions {
    package: string;
    token: string;
    allowFail: boolean;
    failStrategy: 'soft' | 'strict';
    allowMethods: string;
    allowCodes: string;
    skipSchema: boolean;
    env: string;
    timeout: number;
}

export interface Route {
    type: 'incoming' | 'outgoing';
    route: string;
    hostname?: string;
}

export interface FieldMetadata {
    path: string;
    key: string;
    type: string;
    valueType: string;
    example: string;
}

export type BodyMetadata = FieldMetadata | { [key: string]: BodyMetadata } | BodyMetadata[];

export type StringObject = { [key: string]: string };

export interface EnvValue {
    env: string;
    values: {
        url: string;
        requestBody: any;
        urlParams: any;
        requestHeaders: any;
        queryPrams: any; // there is an spelling mistake here which goes all the way to mongo
    };
}

export interface AspectoTest {
    _id: string;
    token: string;
    description: string;
    envValues: EnvValue[];
    executionTime: number;
    packageName: string;
    route: string;
    statusCode: number;
    verb: string;
    createdAt: string;
    updatedAt: string;
}

interface AssertionResult {
    testId: string;
    statusCode: number;
    packageName: string;
    env: string;
    route: string;
    verb: string;
    url: string;
    success: boolean;
    log?: string;
    failedStep?: string;
    stepFailure?: any;
}

export interface TestRunResult {
    testId: string;
    packageName: string;
    env: string;
    route: string;
    verb: string;
    statusCode: number;
    url: string;
    testSnapshot: {
        description: string;
        route: string;
        statusCode: number;
    };
    actualRequest: {
        url: string;
        baseURL: string;
        queryParams: any;
        headers: any;
        body: string;
        verb: string;
    };
    actual: {
        body?: string;
        headers?: any[];
        statusCode?: number;
        executionTimeMs?: number;
        error?: any;
    };
}

export interface AssertionResponse {
    route: string;
    success: boolean;
    assertions: AssertionResult[];
}
