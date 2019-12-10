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
    }

    export interface Global {
        url: string;
        aspectoOptions: TestsOptions;
        verbose: boolean;
    }
}
