const exec = require('child_process').execSync,
assert = require('assert');

const mocks = require('./mocks.js')

describe('cli outputs', () => {
    describe('git-hotspots list', () => {
        it('should return most changed files in repository', function() {
            let result = exec('./src/app-cli.js list ./test/test_repo').toString()
            
            assert.equal(result, mocks.cliOutput)
        });
    });
})
