import { AspectoTest, AssignmentRule } from '../models';

export const attachExtractingTestToAssignRules = (tests: AspectoTest[]) => {
    const testById = tests.reduce((map: Record<string, AspectoTest>, test: AspectoTest) => {
        map[test._id] = test;
        return map;
    }, {});
    tests.forEach((test) => {
        test.rules.rules
            .filter((r: AssignmentRule) => r.assignment?.extractingTestId)
            .forEach((r: AssignmentRule) => (r.assignment.extractingTest = testById[r.assignment.extractingTestId]));
    });
};
