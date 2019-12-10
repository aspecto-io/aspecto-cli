const packageJson = require('../../package.json');
export default () => {
    return packageJson?.name;
};
