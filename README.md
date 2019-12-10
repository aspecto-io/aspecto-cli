<p align="center">
  <img src="https://logo.aspecto.io/logo-v2.png"  style="width: 300px" width="300"/>
</p>

<p align="center" style="font-size: 22px">
  Don't break your APIs
</p>

<p align="center" style="font-size: 22px">
<p align="center">
  <a href="https://github.com/aspecto-io/aspecto/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome"/></a>
  <a href="https://www.npmjs.com/package/@aspecto/cli"><img src="https://img.shields.io/npm/v/@aspecto/cli.svg" alt="Aspecto@npm"/></a>
</p>
</p>

---
<br/>

## What is Aspecto?
Aspecto is the CLI test runner of [Aspecto](https://app.aspecto.io/).  
You can integrate it in your CI, git hooks or just run it manually.  
The CLI will generate a test suite from Aspecto server, based on real data that was collected and prepared beforehand.  
The generated suite will be run against a url you will provide, could be localhost, staging, production or anything else.

## Installation

In your project, run:  
```
yarn add @aspecto/cli --dev
```

You can now run aspecto-cli from your package.json scrips, like this:
```json
...
scripts: {
    "aspecto:test": "aspecto test <url> [options]"
}
...
```
Alternatively, you can install `@aspecto/cli` globally and use it from the terminal from wherever you'd like.

## Usage
`aspecto test <URL> [options]`

### URL 

The url you'd like Aspecto CLI to run the generated tests against.  
Usually, you'd point this on your localhost when testing locally or to your staging url when running on your CI.

### CLI Options

#### `--package <packageName>`

Alias `-p`. This will tell our servers to generate the tests based on which data that was collected beforehand.  
It will usually be the name in your service package.json.  
If you don't provide this option, we will try to get the name from the package.json ourselves.


#### `--token <token>`

Alias `-t`. Your authentication token, provided at https://app.aspecto.io/app/integration.  
If non provided, we'll try to get it ourselves from the `TOKEN` env param (process.env.TOKEN).

#### `---env <envs>`

Alias `-e`. A csv of envs.  
This will tell our servers to generate the tests based on data collected in the provided environments.  
By default, we will create tests based on data from all environments.

Example: `--env production,staging`

#### `--allow-methods <methods>`

Alias `-m`. A csv of http methods.
This will tell our servers to generate the tests based on data collected from routes meeting the allowed methods.  
By default, we will create tests based on all http methods.

Example: `--allow-methods POST,PUT`

#### `--allow-codes`

Alias `-c`. A csv of http status codes.
This will tell our servers to generate the tests based on data collected from responses with status code meeting the allowed codes.  
By default, we will create tests based on all status codes.

Example: `--allow-codes 200,204`

#### `--allow-fail`

Alias `-a`. Use this flag to make the process quit with `1` when failing.  
By default, the process will quit with `0`. 

#### `--fail-strategy <soft|strict>`

Alias `-f`. Relevant only when using `--allow-fail`.  
Soft will fail the process only on a failed test.  
Strict will fail the process on any kind of failure (i.e. bad usage, failure to fetch tests).  

#### `--verbose`

Alias `-v`. Use this flag to print debug logs.

### Examples

```bash
  $ aspecto test http://localhost:3322 --package my-service --token **** --allow-fail --env development -c 200,404 -m GET
  $ aspecto test https://staging.aspecto.com --env staging -a --verbose
  $ aspecto test https://prod.aspecto.com --allow-codes 200,204,500
```

