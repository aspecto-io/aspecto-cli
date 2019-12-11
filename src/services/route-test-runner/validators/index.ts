// @ts-ignore
import * as cities from 'all-the-cities';

const isEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const isUuid = (guid: string) => {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return re.test(String(guid).toLowerCase());
};

const isDateTime = (date: any) => {
    try {
        if (
            date instanceof Date ||
            ((date instanceof String || typeof date === 'string') && !isNaN(Date.parse(date.toString())))
        )
            return true;
    } catch {}
    return false;
};

const isInteger = (val: any) => {
    try {
        if (val.indexOf('.') < 0 && !isNaN(parseInt(val, 1))) return true;
    } catch {}
    return false;
};

const isFloat = (val: any) => {
    try {
        if (!isNaN(parseFloat(val))) return true;
    } catch {}
    return false;
};

const isBool = (val: any) => {
    return val === 'true' || val === 'false' || typeof val === 'boolean';
};

const isString = (val: any) => {
    return typeof val === 'string' || val instanceof String;
};

const isIso4217 = (val: string) => ['EUR', 'USD', 'ILS'].includes(val);

const isCity = (cityToSearch: string) => {
    try {
        if (!cityToSearch) {
            return false;
        }

        const matches = cities.filter((city: any) => {
            if (!city || !city.name) {
                return false;
            }
            return city.name.toLowerCase() == cityToSearch.toLowerCase();
        });

        return matches.length > 0;
    } catch (e) {
        return false;
    }
};

const typeToValidator: { [key: string]: (val: any) => boolean } = {
    uuid: isUuid,
    DateTime: isDateTime,
    integer: isInteger,
    float: isFloat,
    boolean: isBool,
    email: isEmail,
    city: isCity,
    'ISO 4217': isIso4217,
    string: isString,
};

export const getSchema = (value: any) => {
    const entries = Object.entries(typeToValidator);
    for (let i = 0; i < entries.length; i++) {
        if (entries[i][1](value)) {
            return entries[i][0];
        }
    }
};

export const validate = (expectedSchema: string, value: any) => {
    if (!typeToValidator[expectedSchema]) throw new Error(`Unknown type ${expectedSchema} for value of ${value}`);

    return typeToValidator[expectedSchema](value);
};
