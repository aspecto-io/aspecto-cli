export const collectTestParam = (testParam: string, previousMap: Record<string, string>) => {
    const [paramKey, paramVal] = testParam.split(/=(.+)/);

    // if same key defined multiple times, it will override.
    // this behavior is the same as `docker run` -e option which override silently
    previousMap[paramKey] = paramVal;
    return previousMap;
};
