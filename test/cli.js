const assert = require('assert')

const GitHotspots = require('../src/gitHotspots.js'),
mocks = require('./mocks.js')

describe('git-hotspots', () => {
    describe('list', () => {
        it('should return most changed files in repository', async () => {
            await new GitHotspots({
                repo: './test/test_repo'
            })
            .getHotspots()
            .then(filesCount => {
                assert.deepEqual(filesCount, mocks.cliList)
            })
        });
    });
    
    describe('list --since "04.03.2017 23:44" --until "04.03.2017 23:46"', () => {
        it('should return most changed files in repository during a period', async () => {
            await new GitHotspots({
                repo: './test/test_repo',
                since: '04.03.2017 23:44',
                until: '04.03.2017 23:46'
            })
            .getHotspots()
            .then(filesCount => {
                assert.deepEqual(filesCount, mocks.cliListPeriod)
            })
        });
    });
})
