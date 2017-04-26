const exec = require('child_process').execSync,
assert = require('assert');

const mocks = require('./mocks.js')

describe('git-hotspots', () => {
    describe('list', () => {
        it('should return most changed files in repository', function() {
            let result = exec('./src/app-cli.js list ./test/test_repo').toString()
            
            assert.equal(result, mocks.cliOutput)
        });
    });

    describe('list --since "04.03.2017 23:44" --until "04.03.2017 23:46"', () => {
        it('should return most changed files in repository during a period', function() {
            let result = exec('./src/app-cli.js list ./test/test_repo --since "04.03.2017 23:44" --until "04.03.2017 23:46"').toString()
            
            assert.equal(result, mocks.cliOutputPeriod)
        });
    });
})
