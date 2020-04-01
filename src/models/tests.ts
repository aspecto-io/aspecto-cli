import { Rule } from './rules';

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
