import { config } from './protractor.conf';

config.capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: ['--headless', '--no-sandbox']
    }
};

const _config = config;
export { _config as config };