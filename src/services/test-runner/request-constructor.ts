import { StringObject, AspectoTest, TestRule } from '../../types';
import { AxiosRequestConfig, Method } from 'axios';
import calculateTimeout from './timeout-calculator';

const constructQuery = (queryObject?: StringObject): string => {
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

const constructUrl = (origRoute: string, envUrl: string, assignmentRules: any[], testParams: any): string => {
    const origRouteComponents: string[] = origRoute.split('/');
    const envComponents: string[] = envUrl.split('/');
    const rulesByUrlComponentName = assignmentRules.reduce((map, rule) => {
        map[rule.assignment.assignToPath] = rule;
        return map;
    }, {});

    const rulesApplied = origRouteComponents.map((comp, i) => {
        const rule: TestRule = rulesByUrlComponentName[comp];
        if (!rule) return envComponents[i];

        const sourceId = rule.assignment?.sourceId;
        switch (rule.subType) {
            case 'cli-param':
                const paramValue = testParams[sourceId];
                if (!paramValue) throw Error(`missing required cli test-param "${sourceId}"`);
                return paramValue;

            default:
                throw Error(`unable to apply test rule with unsupported subType "${rule.subType}"`);
        }
    });
    return rulesApplied.join('/');
};

export default (test: AspectoTest, testParams: any): AxiosRequestConfig => {
    const envValues = test.envValues[0].values;

    const assignmentRules: TestRule[] = test.rules.rules.filter((r) => r.type === 'assignment');

    const url = constructUrl(
        test.route,
        envValues.url,
        assignmentRules.filter((r) => r.assignment.assignOn === 'urlParam'),
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
        timeout: calculateTimeout(test),
        // timeout: 10000,
    };

    return config;
};
