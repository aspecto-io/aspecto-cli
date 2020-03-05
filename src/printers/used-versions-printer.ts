import 'colors';
import { cli } from 'cli-ux';
import { logger } from '../services/logger';
import { AspectoTest } from '../types';

export const printUsedVersion = (tests: AspectoTest[]) => {
    logger.newLine();
    logger.info('Tests were generated based on:');
    logger.newLine();

    cli.table(tests, {
        env: {
            minWidth: 15,
            get: (row: any) => row.envValues[0].env,
        },
        startAt: {
            minWidth: 25,
            header: 'Approved At',
            get: (row: any) =>
                new Date(row.createdAt).toLocaleDateString() + ' ' + new Date(row.createdAt).toLocaleTimeString(),
        },
        endAt: {
            minWidth: 25,
            header: 'Last Updated',
            get: (row: any) =>
                new Date(row.updatedAt).toLocaleDateString() + ' ' + new Date(row.updatedAt).toLocaleTimeString(),
        },
        gitHash: {
            header: 'Git Hash',
            get: (row: any) => row.firstGitHash.trim(),
        },
    });
    logger.debug(`Tip: you can use the --git-hash flag to fully decide what to base your tests on`.gray);
    logger.newLine();
};
