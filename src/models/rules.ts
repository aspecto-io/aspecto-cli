import { AspectoTest } from './tests';

export type Rule = AssertionRule | ExtractionRule | AssignmentRule;

export enum RuleTypes {
    Assertion = 'assertion',
    Assignment = 'assignment',
    Extraction = 'extraction',
}

// **** ASSERTION ****

export enum AssertionSubType {
    StatusCode = 'statusCode',
    AspectoSchema = 'response-value-types',
}

export interface AssertionRule {
    type: RuleTypes.Assertion;
    subType: AssertionSubType;
    expected: any;
}

// **** EXTRACTION ****

export enum ExtractionSubType {
    ResponseBody = 'response-body',
    ResponseHeaders = 'response-headers',
}

export interface ExtractionRule {
    type: RuleTypes.Extraction;
    subType: ExtractionSubType;
    extraction: {
        fromPath: string;
        destinationId: string;
    };
}

// **** ASSIGNMENT ****

export enum AssignmentSubType {
    CliParam = 'cli-param',
    FromExtraction = 'from-extraction',
    Const = 'const',
}

export enum AssignOn {
    URLParam = 'urlParam',
    QueryParam = 'queryParam',
    Header = 'header',
    Body = 'body',
    Cookie = 'cookie',
}

export interface AssignmentRule {
    type: RuleTypes.Assignment;
    subType: AssignmentSubType;
    assignment: {
        assignOn: AssignOn;
        assignToPath: string;
        sourceId: string;
        extractingTestId?: string;
        extractingTest?: AspectoTest;
    };
}

export const assignOnToDisplayText = (assignOn: AssignOn) => {
    switch (assignOn) {
        case AssignOn.URLParam:
            return 'URL Param';
        case AssignOn.QueryParam:
            return 'Query Param';
        default:
            return assignOn.charAt(0).toUpperCase() + assignOn.slice(1);
    }
};
