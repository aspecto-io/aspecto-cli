#!/usr/bin/env node
require('./cli-program');
import testInternal from './handlers/tests-handler';
import { TestsOptions as TestsOptionsInternal } from './types';

export type TestsOptions = Partial<TestsOptionsInternal>;
export const test = (url: string, options: TestsOptions) => testInternal(url, options as TestsOptionsInternal);
