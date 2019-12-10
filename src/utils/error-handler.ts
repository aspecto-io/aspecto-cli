import 'colors';
import { logger } from '../services/logger';

const handle = (errorMessage: string, description?: string) => {
    logger.error(errorMessage);
    description && logger.debug(description.grey);

    if (!global.aspectoOptions.allowFail) {
        return process.exit(0);
    }

    process.exit(global.aspectoOptions.failStrategy === 'soft' ? 0 : 1);
};

export default handle;
