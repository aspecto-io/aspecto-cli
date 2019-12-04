#!/usr/bin/env node

import * as commander from 'commander';
import handleTestAction from './handlers/tests.handler';
const program = new commander.Command();
program.version('0.0.1');

// URL to test
// Token
program
    .command('run')
    .description('Run API Tests')
    .option('--allow-fail', 'Whether to fail the process', false)
    .option('--allow-methods', 'Which type of http request to test', 'get,post,put,delete')
    .option('--mono-repo', 'Whether it is a mono repo', false)
    .option('--service-name [service]', 'Which service to test; default is the current service by package.json')
    .option('--git-hash [git]', 'Force test for specific git hash; by default will use the current code')
    // .requiredOption('-t --token <token>',"Your authentication token")
    .action(handleTestAction);

program.parse(process.argv);
