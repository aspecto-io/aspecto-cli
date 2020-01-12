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

export interface RouteTestEntry {
    route: string;
    routeDetails: RouteDetails[];
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

export interface AssertionResponse {
    route: string;
    success: boolean;
    assertions: AssertionResult[];
}
