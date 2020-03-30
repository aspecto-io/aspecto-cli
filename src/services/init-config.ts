import { TestsOptions } from '../types';
import packageNameRetriever from '../utils/package-name-retriever';
import handleError from '../utils/error-handler';

export default (url: string, options: TestsOptions) => {
    options.token = options.token || process.env.ASPECTO_TOKEN;
    options.failStrategy = options.failStrategy || 'soft';
    global.aspectoMetadata = { didSetTimeout: !!options.timeout };
    options.timeout = parseInt(options.timeout as any) || 5000;

    global.aspectoOptions = options;
    global.verbose = options.verbose;
    global.url = url;

    if (!options.token) {
        handleError(
            'token was not provided with --token option and no environment variable named ASPECTO_TOKEN is found.'
        );
    }

    if (!options.package) {
        const packageName = packageNameRetriever();
        if (!packageName) {
            handleError('package was not provided with --package option and could not be retrieved from package.json.');
        }
        options.package = packageName;
    }
};
