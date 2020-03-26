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
    const jsonPath = rule.extraction.fromPath;
    const destinationId = rule.extraction.destinationId;

    if (jsonPath === '$.') return { value: body };

    // if the jsonPath is not '$.' then its a query on JSON, so body has to be object
    if (typeof body !== 'object') return { error: `Could not extract test param - response body is not JSON` };

    let queryResult;
    try {
        queryResult = jsonpath.query(body, jsonPath);
    } catch (err) {
        return { error: `Failed to extract path '${jsonPath}' from response body` };
    }

    if (queryResult.length == 0) return { error: `No data found for path '${jsonPath}' in response body` };
    else {
        if (queryResult.length > 1)
            logger.debug(
                `Extracting params '${destinationId}' from response body - the first value was chosen from possible ${queryResult.length} values for path "${jsonPath}"`
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
