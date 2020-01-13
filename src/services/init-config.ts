import { TestsOptions } from '../types';
import packageNameRetriever from '../utils/package-name-retriever';
import handleError from '../utils/error-handler';

export default (url: string, options: TestsOptions) => {
    options.token = options.token || process.env.ASPECTO_TOKEN;
    options.failStrategy = options.failStrategy || 'soft';
    global.aspectoMetadata = { didSetTimeout: !!options.timeout };
    options.timeout = parseInt(options.timeout as any) || 5000;

    global.aspectoOptions = options;
    global.url = url;

    if (!options.token) {
        handleError('token was not provider and could not be retrieved from process.env.ASPECTO_TOKEN.');
    }

    if (!options.package) {
        const packageName = packageNameRetriever();
        if (!packageName) {
            handleError('serviceName was not provider and could not be retrieved from package.json.');
        }
        options.package = packageName;
    }
};
