export interface TestsOptions {
    package: string;
    token: string;
    allowFail: boolean;
    failStrategy: 'soft' | 'strict';
    allowMethods: string;
    allowCodes: string;
    skipSchema: boolean;
    env: string;
}

export interface Route {
    _id: string;
}

type GenericObject = { [key: string]: any };

export interface VariableAnalysis {
    name: string;
    type: string;
    isNull: boolean;
    isMultiple: boolean;
    valueType: string;
    children: any[];
    example: string;
}

export type RequestDetailsPayload =
    | VariableAnalysis
    | { [key: string]: RequestDetailsPayload }
    | RequestDetailsPayload[];

export interface RouteDetails {
    _id: string;
    env: string;
    gitHash: string;
    packageVersion: string;
    route: string;
    statusCode: number;
    token: string;
    url: string;
    verb: 'get' | 'post' | 'put' | 'delete' | 'patch';
    createdAt: Date;
    functionChain: string;
    queryParams?: RequestDetailsPayload;
    params?: GenericObject;
    requestBody?: RequestDetailsPayload;
    requestHeaders: RequestDetailsPayload;
    responseBody: RequestDetailsPayload;
    responseHeaders: GenericObject;
    updatedAt: Date;
    hostname: string;
}

export interface RouteTestEntry {
    route: string;
    routeDetails: RouteDetails[];
}

export interface RouteTestSuiteSummary {
    totalTestCount: number;
    failCount: number;
    passCount: number;
    routeName: string;
    results: {
        failed: boolean;
        testName: string;
        id: string;
        failLog: string;
        duration: number;
    }[];
}
