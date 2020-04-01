import { AspectoTest, ExtractionParamValue, Rule, RuleTypes, AssignmentRule } from '../../models';
import { AxiosRequestConfig, Method } from 'axios';
import { globalExtractedParams } from './response-extraction';

const constructQuery = (queryObject?: Record<string, string>): string => {
    const query: string[] = [];
    if (queryObject) {
        Object.entries(queryObject).forEach(([queryName, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v: string) => query.push(`${queryName}=${encodeURIComponent(v)}`));
            } else query.push(`${queryName}=${encodeURIComponent(value)}`);
        });
    }
    return query.length > 0 ? '?' + query.join('&') : '';
};

const constructUrl = (originalRoute: string, envUrl: string, assignmentRules: any[], testParams: any): string => {
    const originalRouteSegments: string[] = originalRoute.split('/');
    const envSegments: string[] = envUrl.split('/');
    const rulesByUrlSegmentName = assignmentRules.reduce((map, rule) => {
        map[rule.assignment.assignToPath] = rule;
        return map;
    }, {});

    const rulesApplied = originalRouteSegments.map((segment, i) => {
        const rule: Rule = rulesByUrlSegmentName[segment];
        if (!rule) return envSegments[i];

        const sourceId = (rule as AssignmentRule).assignment?.sourceId;
        if (sourceId === undefined) throw new Error(`Cannot assign test parameter, source id is missing`);
        const extractingTest: AspectoTest = (rule as AssignmentRule).assignment?.extractingTest;
        const extractingTestDescription = extractingTest?.description ? `'${extractingTest?.description}'` : ``;

        switch (rule.subType) {
            case 'cli-param': {
                const paramValue = testParams[sourceId];
                if (!paramValue)
                    throw new Error(
                        `Missing required CLI test-param '${sourceId}' for URL paramter '${segment}' in route '${originalRoute}'.\nYou can supply the value using CLI option --test-param "${sourceId}={your-param-value}"`
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
    });
    return rulesApplied.join('/');
};

export default (test: AspectoTest, testParams: any): AxiosRequestConfig => {
    const envValues = test.envValues[0].values;

    const assignmentRules: Rule[] = test.rules.rules.filter((r) => r.type === RuleTypes.Assignment);

    const url = constructUrl(
        test.route,
        envValues.url,
        assignmentRules.filter((r: AssignmentRule) => r.assignment.assignOn === 'urlParam'),
        testParams
    );

    const config: AxiosRequestConfig = {
        method: test.verb as Method,
        baseURL: global.url,
        url: `${url}${constructQuery(envValues.queryPrams)}`,
        data: envValues.requestBody,
        headers: {
            ...envValues.requestHeaders,
            'X-Origin': 'Aspecto-CLI',
        },
        validateStatus: () => true,
        timeout: global.aspectoOptions.timeout,
    };

    return config;
};
