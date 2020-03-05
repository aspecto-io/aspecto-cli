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
    gitHash: string;
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

export interface RouteDetails {
    _id: string;
    env: string;
    gitHash: string;
    packageVersion: string;
    packageName: string;
    route: string;
    statusCode: number;
    token: string;
    url: string;
    verb: 'get' | 'post' | 'put' | 'delete' | 'patch';
    createdAt: Date;
    functionChain: string;
    fullUrl: string;
    queryParams?: StringObject;
    params?: StringObject;
    requestBody?: any;
    requestHeaders: StringObject;
    responseHeaders: StringObject;
    updatedAt: Date;
    hostname: string;
    type: 'incoming' | 'outgoing';
    executionTime: number;
    schemaHash: string;
    rawResponseBody: any;
    responseBodySchema: any;
    responseMetadata: {
        _id: string;
        responseMetadata: BodyMetadata;
    };
}

export interface EnvValue {
    env: string;
    values: {
        url: string;
        requestBody: any;
        urlParams: any;
        requestHeaders: any;
        queryParams: any;
    };
}

export interface AspectoTest {
    _id: string;
    token: string;
    description: string;
    envValues: EnvValue[];
    executionTime: number;
    firstGitHash: string;
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
    gitHash: string;
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
    gitHash: string;
    route: string;
    verb: string;
    statusCode: number;
    url: string;
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
