import { AspectoTest, RuleTypes, AssignmentRule, AssignOn } from '../../models';
import { AxiosRequestConfig, Method } from 'axios';
import constructHeaders from './headers-constructor';
import getDynamicParam from './get-dynamic-parameter';

const constructQuery = (queryObject: Record<string, string> = {}, assignmentRules: AssignmentRule[]): string => {
    const queryCopy = { ...queryObject };
    assignmentRules.forEach((r) => {
        queryCopy[r.assignment.assignToPath] = getDynamicParam(r);
    });

    const query: string[] = [];
    Object.entries(queryCopy).forEach(([queryName, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v: string) => query.push(`${queryName}=${encodeURIComponent(v)}`));
        } else query.push(`${queryName}=${encodeURIComponent(value)}`);
    });
    return query.length > 0 ? '?' + query.join('&') : '';
};

const constructUrl = (originalRoute: string, envUrl: string, assignmentRules: AssignmentRule[]): string => {
    const originalRouteSegments: string[] = originalRoute.split('/');
    const envSegments: string[] = envUrl.split('/');
    const rulesByUrlSegmentName = assignmentRules.reduce((map: Record<string, AssignmentRule>, rule) => {
        map[rule.assignment.assignToPath] = rule;
        return map;
    }, {});

    const rulesApplied = originalRouteSegments.map((segment, i) => {
        const rule: AssignmentRule = rulesByUrlSegmentName[segment];
        return rule ? getDynamicParam(rule) : envSegments[i];
    });
    return rulesApplied.join('/');
};

export default (test: AspectoTest): AxiosRequestConfig => {
    const envValues = test.envValues[0].values;

    const assignmentRules: AssignmentRule[] = test.rules.rules.filter(
        (r) => r.type === RuleTypes.Assignment
    ) as AssignmentRule[];

    const url = constructUrl(
        test.route,
        envValues.url,
        assignmentRules.filter((r) => r.assignment.assignOn === AssignOn.URLParam)
    );

    const query = constructQuery(
        envValues.queryPrams,
        assignmentRules.filter((r) => r.assignment.assignOn === AssignOn.QueryParam)
    );

    const headers = constructHeaders(
        envValues.requestHeaders,
        assignmentRules.filter((r) => r.assignment.assignOn === AssignOn.Header),
        assignmentRules.filter((r) => r.assignment.assignOn === AssignOn.Cookie)
    );

    const config: AxiosRequestConfig = {
        method: test.verb as Method,
        baseURL: global.url,
        url: url + query,
        data: envValues.requestBody,
        headers,
        validateStatus: () => true,
        timeout: global.aspectoOptions.timeout,
    };

    return config;
};
