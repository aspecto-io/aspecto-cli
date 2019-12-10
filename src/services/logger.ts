import 'colors';

export const logger = {
    warn: (args: any) => console.log(args),
    debug: (args: any) => global.verbose && console.log(args),
    info: (args: any) => console.log(args),
    log: (args: any) => console.log(args),
    error: (args: any) => console.log(args.red),
    newLine: () => console.log(''),
};
