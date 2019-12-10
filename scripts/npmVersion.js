/* eslint-disable */
const { exec } = require('child_process');
const fs = require('fs');

console.log('reading package.json from', process.cwd());
const packageJson = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf-8'));

exec(
    `npm info ${packageJson.name} --json`,
    {
        cwd: process.cwd(),
    },
    (error, stdout) => {
        if (error) {
            console.error('Could not bump version due to an error');
            console.error(error);
            process.exit(1);
        }

        const packageInfo = JSON.parse(stdout);
        const latestVersion = packageInfo['dist-tags'].latest;
        console.log('latest version is:', latestVersion);

        const version = latestVersion.split('.');

        console.log('Checking if the major or minor version have changed in Git');
        const packageVersion = packageJson.version.split('.');

        if (Number(packageVersion[0]) === Number(version[0]) && Number(packageVersion[1]) === Number(version[1])) {
            console.log('bumping...');
        } else {
            console.log('The major or minor versions have changed, not bumping anything');
            process.exit(0);
        }

        version[2] = (Number(version[2]) + 1).toString();

        const bumpVersion = version.join('.');

        console.log('Bumping version to:', bumpVersion);

        packageJson.version = bumpVersion;

        fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
        console.log('New version saved in package.json file');
        process.exit(0);
    }
);
