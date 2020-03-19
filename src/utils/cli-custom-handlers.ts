export const collectTestParam = (testParam: string, testParamsStore: any) => {
    let [paramKey, paramVal] = testParam.split(/=(.+)/);

    // you can use variables that are in the local environment (like with `docker run` -e option)
    if (paramVal === undefined) {
        paramVal = process.env[paramKey];
    }

    // if same key defined multiple times, it will override.
    // this behavior is the same as `docker run` -e option which override silently
    testParamsStore[paramKey] = paramVal;
    return testParamsStore;
};
