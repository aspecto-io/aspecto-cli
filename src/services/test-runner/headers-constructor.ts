import { AssignmentRule } from '../../models';
import getDynamicParam from './get-dynamic-parameter';

const getCookieString = (cookies: Record<string, string>) =>
    Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');

export default (
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
