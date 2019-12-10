export default () => {
    try {
        return JSON.parse(
            require('fs')
                .readFileSync('package.json')
                .toString()
        ).name;
    } catch (err) {
        return null;
    }
};
