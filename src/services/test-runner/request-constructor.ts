import { AspectoTest, RuleTypes, AssignmentRule, AssignOn } from '../../models';
import { AxiosRequestConfig, Method } from 'axios';
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

const getCookieString = (cookies: Record<string, string>) =>
    Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');

const constructHeaders = (
    rawHeaders: Record<string, string> = {},
    headerRules: AssignmentRule[],
    cookieRules: AssignmentRule[]
) => {
    const headers = { ...rawHeaders };
    headers['X-Origin'] = 'Aspecto-CLI';

    headerRules.forEach((r) => {
        headers[r.assignment.assignToPath] = getDynamicParam(r);
    });
    if (cookieRules.length === 0) return headers;

    const dynamicCookies: Record<string, string> = {};
    cookieRules.forEach((r) => {
        dynamicCookies[r.assignment.assignToPath] = getDynamicParam(r);
    });
    const existingCookieHeaderKey = Object.keys(headers).find((k) => k.toLowerCase() === 'cookie');
    if (!existingCookieHeaderKey) {
        headers.Cookie = getCookieString(dynamicCookies);
    } else {
        // Merge dynamic cookies with existing, overwrite if needed
        const existingCookieHeader = headers[existingCookieHeaderKey];

        const cookies: Record<string, string> = {};
        existingCookieHeader.split('; ').forEach((nameValuePair) => {
            const [name, value] = nameValuePair.split(/=(.+)/);
            cookies[name] = value;
        });
        Object.entries(dynamicCookies).forEach(([k, v]) => (cookies[k] = v));
        headers[existingCookieHeaderKey] = getCookieString(cookies);
    }
    return headers;
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
