import { AssignmentRule, AspectoTest, assignOnToDisplayText, ExtractionParamValue } from '../../models';
import { globalExtractedParams } from './response-extraction';

export default (rule: AssignmentRule) => {
    const sourceId = (rule as AssignmentRule).assignment?.sourceId;
    if (sourceId === undefined) throw new Error(`Cannot assign test parameter, sourceId is missing`);
    const extractingTest: AspectoTest = rule.assignment?.extractingTest;
    const extractingTestDescription = extractingTest?.description ? `'${extractingTest?.description}'` : ``;
    const testParams = global.aspectoOptions.testParam;

    switch (rule.subType) {
        case 'cli-param': {
            const paramValue = testParams[sourceId] ?? process.env[sourceId];
            if (!paramValue)
                throw new Error(
                    `Missing required CLI test-param '${sourceId}' for ${assignOnToDisplayText(
                        rule.assignment.assignOn
                    )} '${rule.assignment.assignToPath}'.\
                    You can supply the value using CLI option --test-param "${sourceId}={your-param-value}" or set it in your environment.`
                );
            return paramValue;
        }
        case 'from-extraction': {
            const extractionParamValue: ExtractionParamValue = globalExtractedParams[sourceId];
            if (!extractionParamValue)
                throw new Error(
                    `Missing required parameter from previous test ${extractingTestDescription}. It might have been skipped or failed to run.`
                );

            if (extractionParamValue.value == undefined)
                throw new Error(
                    `Missing required parameter from previous test ${extractingTestDescription} which failed to extract the value.\n${extractionParamValue.error}.`
                );

            return extractionParamValue.value;
        }
        case 'const':
            return sourceId;

        default:
            throw new Error(`Cannot assign test parameter - unsupported subType '${rule.subType}'`);
    }
};
