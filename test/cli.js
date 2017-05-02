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
})
