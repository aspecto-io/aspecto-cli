import 'colors';
import { cli } from 'cli-ux';
import { logger } from '../services/logger';
import { AspectoTest } from '../types';

export const printGeneratedTests = (tests: AspectoTest[]) => {
    logger.newLine();
    logger.info('Tests were generated based on:');
    logger.newLine();

    cli.table(tests, {
        description: {
            minWidth: 25,
            get: (row: AspectoTest) => row.description,
        },
        env: {
            minWidth: 15,
            get: (row: AspectoTest) => row.envValues[0].env,
        },
        startAt: {
            minWidth: 25,
            header: 'Approved At',
            get: (row: AspectoTest) =>
                new Date(row.createdAt).toLocaleDateString() + ' ' + new Date(row.createdAt).toLocaleTimeString(),
        },
        endAt: {
            minWidth: 25,
            header: 'Last Updated',
            get: (row: AspectoTest) =>
                new Date(row.updatedAt).toLocaleDateString() + ' ' + new Date(row.updatedAt).toLocaleTimeString(),
        },
    });
    logger.newLine();
};
