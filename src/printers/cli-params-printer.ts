import 'colors';
import { logger } from '../services/logger';

export const printParams = () => {
    const options = global.aspectoOptions;
    const url = global.url;

    const entries = Object.entries(options);

    logger.info(`test url:`.padEnd(15).bold + ' ' + url);
    entries
        .filter((e) => e[1] !== undefined)
        .forEach(([key, value]: [string, any]) => {
            let displayValue: string;
            switch (key) {
                case 'version':
                    return;
                case 'token':
                    displayValue = '••••';
                    break;
                case 'testParam':
                    displayValue = Object.entries(value)
                        .map(([k, v]) => `"${k}=${v}"`)
                        .join(', ');
                    break;
                default:
                    displayValue = value;
            }
            logger.info(
                `${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:`.padEnd(15).bold + ' ' + displayValue
            );
        });

    entries
        .filter((e) => e[1] === undefined)
        .forEach(([key, _value]: [string, any]) => {
            const defaultValue = getDefaultValue(key);
            logger.debug(
                `${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:`.padEnd(15).gray.bold +
                    ` ${defaultValue} (default)`.gray
            );
        });

    logger.newLine();
    logger.newLine();
};

const getDefaultValue = (option: string) => {
    switch (option) {
        case 'allowMethods':
        case 'allowCodes':
        case 'env':
            return 'all';
        default:
            return 'false';
    }
};
