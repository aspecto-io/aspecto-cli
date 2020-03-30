#!/usr/bin/env node
//The reference is required for ts-node as it forces loading .d.ts file.
/// <reference path="./global.d.ts" />
import testInternal from './handlers/tests-handler';
import { TestsOptions as TestsOptionsInternal } from './types';

export type TestsOptions = Partial<TestsOptionsInternal>;
export const test = (url: string, options: TestsOptions) => testInternal(url, options as TestsOptionsInternal);
