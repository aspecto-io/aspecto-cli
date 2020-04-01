import { Rule } from './rules';

export interface EnvValue {
    env: string;
    values: {
        url: string;
        requestBody: any;
        urlParams: Record<string, string>;
        requestHeaders: Record<string, string>;
        queryPrams: Record<string, string>; // there is a spelling mistake here which goes all the way to mongo
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
    responseBodySchemaHash: string;
    rules: { rules: Rule[] };
}
