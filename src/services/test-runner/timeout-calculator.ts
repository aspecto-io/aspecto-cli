export default (test: any) => {
    // If the user decided to set a custom timeout we will use it.
    if (test?.executionTime > 0 && !global.aspectoMetadata.didSetTimeout) {
        return Math.ceil(test.executionTime / 1000) * 1000;
    } else {
        return global.aspectoOptions.timeout;
    }
};
