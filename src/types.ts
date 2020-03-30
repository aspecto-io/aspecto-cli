export interface TestsOptions {
    package: string;
    token: string;
    allowFail: boolean;
    failStrategy: 'soft' | 'strict';
    allowMethods: string;
    allowCodes: string;
    env: string;
    timeout: number;
    testParam: any;
    verbose: boolean;
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
        queryPrams: any; // there is a spelling mistake here which goes all the way to mongo
    };
}

export enum RuleTypes {
    Assertion = 'assertion',
    Assignment = 'assignment',
    Extraction = 'extraction',
}

export interface TestRule {
    type: string;
    subType: string;
    assignment?: any;
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
    responseBodySchemaHash: string;
    rules: { rules: TestRule[] };
}

export interface TestAndCliMetadata {
    test: AspectoTest;
    filters: string[];
}

export interface TestRunResult {
    testId: string;
    env: string;
    testSnapshot: {
        packageName: string;
        description: string;
        route: string;
        statusCode: number;
        verb: string;
        responseBodySchemaHash: string;
    };
    actualRequest?: {
        url: string;
        baseURL: string;
        queryParams: any;
        headers: any;
        body: string;
        verb: string;
    };
    actualResponse: {
        body?: string;
        headers?: any[];
        statusCode?: number;
        executionTimeMs?: number;
        error?: any;
        filteredReasons?: string[];
    };
}

export interface TestRunResultWithAssertion extends TestRunResult {
    assertionResult: {
        success: boolean;
        skipped: boolean;
        log?: string;
        failedStep?: string;
        stepFailure?: any;
    };
}

export interface RouteAssertionResults {
    route: string;
    skippedCount: number;
    failedCount: number;
    passedCount: number;
    assertions: TestRunResultWithAssertion[];
}

export interface ExtractionParamValue {
    value?: string;
    error?: string;
}
