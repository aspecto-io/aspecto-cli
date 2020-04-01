import { AspectoTest } from '../models';
import { client } from './api-tests-client';
import { attachExtractingTestToAssignRules } from './test-enrichment';

export const fetchAllTests = async (packageName: string): Promise<AspectoTest[]> => {
    // assuming that each suite name is it's package name.
    // this is likely to change in the future
    const response = await client.get<{ tests: AspectoTest[] }>(`/suites?name=${packageName}`);
    const tests = response.data.tests;
    attachExtractingTestToAssignRules(tests);
    return tests;
};
