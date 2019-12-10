#!/usr/bin/env node
import handleTestAction from './handlers/tests-handler';
import * as commander from 'commander';
const program = new commander.Command();
const packageJson = require('../package.json');

program.version(packageJson.version);

program
    .arguments('<cmd> <url>')
    .option(
        '-p, --package <package>',
        "Which package to test\nIf none provided, we'll try to get it from your package.json"
    )
    .option(
        '-t, --token <token>',
        'Your authentication token, provided at https://app.aspecto.io/app/integration.\nAlternatively, can be passed as ASPECTO_TOKEN env param.'
    )
    .option('-e, --env <envs>', 'csv of environments the we generate the tests from (i.e. prod,dev), default is all')
    .option(
        '-m, --allow-methods <methods>',
        'csv of which type of http request methods to test (i.e. get,post,put), default is all'
    )
    .option(
        '-c, --allow-codes <codes>',
        'csv of which type of http response codes to test (i.e. 200,400,404), default is all'
    )
    .option('-a, --allow-fail', 'Whether to fail the process')
    .option(
        '-f, --fail-strategy <strategy>',
        'soft - fail the process only on failed tests. strict - fail the process on any kind of failure',
        'soft'
    )
    .option('-s --skip-schema', 'Should skip testing response expected schemas')
    .option('-v --verbose', 'Print debug logs')
    .action((command: string, url: string, prog: any) => {
        if (command !== 'test') {
            console.log('Unknown command, available commands are: test');
            return;
        }
        handleTestAction(url, prog.opts());
    });

program.name('aspecto test').usage('<url to test> [options]');

program.on('--help', () => {
    console.log('Examples:');
    console.log(
        '  $ aspecto test http://localhost:3030 --package my-service --env staging --allow-methods get,post --allow-codes 200,204'
    );
    console.log('  $ aspecto test http://localhost:3030 --allow-fail\n');
});

program.on('option:verbose', function() {
    (global as any).verbose = this.verbose;
});

program.parse(process.argv);
