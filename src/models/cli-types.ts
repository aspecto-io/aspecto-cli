import { AspectoTest } from './tests';

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
