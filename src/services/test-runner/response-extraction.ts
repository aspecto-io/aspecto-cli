import { AspectoTest, RuleTypes, ExtractionParamValue } from '../../types';
import { AxiosResponse } from 'axios';
import * as jsonpath from 'jsonpath';
import { logger } from '../logger';

// key is param id, value is ExtractionParamValue
export const globalExtractedParams: any = {};

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

const extractFromJsonBody = (rule: ExtractionRule, body: any): ExtractionParamValue => {
    if (typeof body !== 'object') return { error: `could not extract test param - response body is not JSON` };

    const jsonPath = rule.extraction.fromPath;
    const destinationId = rule.extraction.destinationId;

    const queryResult = jsonpath.query(body, jsonPath);
    if (queryResult.length == 0) return { error: `could not extract path '${jsonPath}' from response body` };
    else {
        if (queryResult.length > 1)
            logger.debug(
                `Extracting params '${destinationId}' from response body - one value chosen from possible ${queryResult.length} for path "${jsonPath}"`
            );
        return { value: queryResult[0] };
    }
};

const extractHeader = (rule: ExtractionRule, headers: any): ExtractionParamValue => {
    const headerName = rule.extraction.fromPath;

    const paramValue = headers[headerName];
    if (paramValue === undefined) return { error: `header "${headerName}" not found in response headers` };
    else return { value: paramValue };
};

export const extractValuesFromResponse = (test: AspectoTest, httpResponse: AxiosResponse) => {
    test.rules.rules
        .filter((rule) => rule.type === RuleTypes.Extraction)
        .forEach((rule: ExtractionRule) => {
            let extractionVal: ExtractionParamValue;
            switch (rule.subType) {
                case ExtractionSubType.ResponseBody:
                    extractionVal = extractFromJsonBody(rule, httpResponse.data);
                    break;
                case ExtractionSubType.ResponseHeaders:
                    extractionVal = extractHeader(rule, httpResponse.headers);
                    break;
                default:
                    extractionVal = {
                        error: `unsupported extraction source "${rule.subType}"`,
                    };
            }
            globalExtractedParams[rule.extraction.destinationId] = extractionVal;
        });
};
