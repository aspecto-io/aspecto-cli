import 'colors';
import { cli } from 'cli-ux';
import { logger } from '../services/logger';

export const printUsedVersion = (versions: any) => {
    logger.newLine();
    logger.info('Tests were generated based on:');
    logger.newLine();

    cli.table(versions, {
        env: {
            minWidth: 15,
            get: (row: any) => row.env,
        },
        startAt: {
            minWidth: 25,
            header: 'First Appeared',
            get: (row: any) =>
                new Date(row.startTime).toLocaleDateString() + ' ' + new Date(row.startTime).toLocaleTimeString(),
        },
        endAt: {
            minWidth: 25,
            header: 'Last Updated',
            get: (row: any) =>
                new Date(row.endTime).toLocaleDateString() + ' ' + new Date(row.endTime).toLocaleTimeString(),
        },
        gitHash: {
            header: 'Git Hash',
            get: (row: any) => row.gitHash.trim(),
        },
    });
    logger.debug(`Tip: you can use the --git-hash flag to fully decide what to base your tests on`.gray);
    logger.newLine();
};
