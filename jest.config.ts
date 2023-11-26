import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    roots: ['<rootDir>'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '(.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
    coverageReporters: ['text', 'lcov'],
};

export default config;
