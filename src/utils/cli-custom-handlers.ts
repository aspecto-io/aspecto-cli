export const collectTestParam = (testParam: string, testParamsStore: any) => {
    const splitIndex = testParam.indexOf('=');

    let paramKey, paramVal: string;
    // you can use variables that are in the local environment (like with `docker run` -e option)
    if (splitIndex == -1) {
        paramKey = testParam;
        paramVal = process.env[paramKey];
    } else {
        paramKey = testParam.substring(0, splitIndex);
        paramVal = testParam.substring(splitIndex + 1);
    }

    // if same key defined multiple times, it will override.
    // this behavior is the same as `docker run` -e option which override silently
    testParamsStore[paramKey] = paramVal;
    return testParamsStore;
};
