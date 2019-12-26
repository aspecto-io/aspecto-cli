declare namespace NodeJS {
    interface TestsOptions {
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
