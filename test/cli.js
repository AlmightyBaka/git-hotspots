const assert = require('assert')

const GitHotspots = require('../src/gitHotspots.js'),
mocks = require('./mocks.js')

describe('git-hotspots', () => {
    describe('list', () => {
        it('should return most changed files in repository', async () => {
            let result = await new Promise((resolve, reject) => {
                new GitHotspots({
                    repo: './test/test_repo'
                })
                .getHotspots()
                .then(filesCount => {
                    resolve(filesCount)
                })
                .catch(error => reject(error))
            })
            
            assert.deepEqual(result, mocks.cliList)
        });
    });
    
    describe('list --since "04.03.2017 23:44" --until "04.03.2017 23:46"', () => {
        it('should return most changed files in repository during a period', async () => {
            let result = await new Promise((resolve, reject) => {
                new GitHotspots({
                    repo: './test/test_repo',
                    limits: {
                        since: '04.03.2017 23:44',
                        until: '04.03.2017 23:46'
                    }
                })
                .getHotspots()
                .then(filesCount => {
                    resolve(filesCount)
                })
                .catch(error => reject(error))
            })
            
            assert.deepEqual(result, mocks.cliListPeriod)
        });
    });
    
    describe('list --include "**/*.html" --exclude "{index*,layout*}"', () => {
        it('should return most changed files in repository filtered by glob', async () => {
            let result = await new Promise((resolve, reject) => {
                new GitHotspots({
                    repo: './test/test_repo',
                    limits: {
                        include: '**/*.html',
                        exclude: '{index*,layout*}'
                    }
                })
                .getHotspots()
                .then(filesCount => {
                    resolve(filesCount)
                })
                .catch(error => reject(error))
            })
            
            assert.deepEqual(result, mocks.cliListGlob)
        });
    });
    
    describe('list --since-commit "74b3a326c7337237fc4563ede3976d20cf549534" --until-commit "fa8e20f"', () => {
        it('should return most changed files in repository between commits', async () => {
            let result = await new Promise((resolve, reject) => {
                new GitHotspots({
                    repo: './test/test_repo',
                    limits: {
                        sinceCommit: '74b3a326c7337237fc4563ede3976d20cf549534',
                        untilCommit: 'fa8e20f'
                    }
                })
                .getHotspots()
                .then(filesCount => {
                    resolve(filesCount)
                })
                .catch(error => reject(error))
            })
            
            assert.deepEqual(result, mocks.cliListPeriodHash)
        });
    });
})
