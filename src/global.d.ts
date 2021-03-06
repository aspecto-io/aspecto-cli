declare namespace NodeJS {
    interface TestsOptions {
        package: string;
        token: string;
        allowFail: boolean;
        failStrategy: 'soft' | 'strict';
        allowMethods: string;
        allowCodes: string;
        env: string;
        timeout: number;
        testParam: Record<string, string>;
    }

    export interface Global {
        url: string;
        aspectoOptions: TestsOptions;
        verbose: boolean;
        aspectoMetadata: userInteractionMetadata;
    }

    export interface userInteractionMetadata {
        didSetTimeout: boolean;
    }
}
