import 'colors';
import { cli } from 'cli-ux';
import { logger } from '../services/logger';
import { AspectoTest, TestAndCliMetadata } from '../types';

export const printGeneratedTests = (tests: TestAndCliMetadata[]) => {
    logger.newLine();
    logger.info('Tests were generated based on:');
    logger.newLine();

    cli.table(tests, {
        description: {
            minWidth: 25,
            get: (row: TestAndCliMetadata) => row.test.description,
        },
        env: {
            minWidth: 15,
            get: (row: TestAndCliMetadata) => row.test.envValues[0].env,
        },
        startAt: {
            minWidth: 25,
            header: 'Approved At',
            get: (row: TestAndCliMetadata) =>
                new Date(row.test.createdAt).toLocaleDateString() +
                ' ' +
                new Date(row.test.createdAt).toLocaleTimeString(),
        },
        endAt: {
            minWidth: 25,
            header: 'Last Updated',
            get: (row: TestAndCliMetadata) =>
                new Date(row.test.updatedAt).toLocaleDateString() +
                ' ' +
                new Date(row.test.updatedAt).toLocaleTimeString(),
        },
        status: {
            minWidth: 25,
            header: 'Run Status',
            get: (row: TestAndCliMetadata) =>
                row.filterResult.pass ? 'Schedule to run' : 'Filtered by command line options',
        },
    });
    logger.newLine();
};
