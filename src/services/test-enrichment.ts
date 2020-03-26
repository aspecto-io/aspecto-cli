import { AspectoTest } from '../types';

export const attachExtractingTestToAssignRules = (tests: AspectoTest[]) => {
    const testById = tests.reduce((map: Record<string, AspectoTest>, test: AspectoTest) => {
        map[test._id] = test;
        return map;
    }, {});
    tests.forEach((test) => {
        test.rules.rules
            .filter((r) => r.assignment?.extractingTestId)
            .forEach((r) => (r.assignment.extractingTest = testById[r.assignment.extractingTestId]));
    });
};
