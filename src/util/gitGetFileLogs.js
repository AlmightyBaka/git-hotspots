const exec = require('child_process').exec,
execSync = require('child_process').execSync,
path = require('path')

const gochan = require('gochan')

const logger = require('./logger.js')

const tokens = gochan()

let getFileLogs = function(files, settings) {
    let getGitCommand = (file) => {
        return `git --git-dir ${path.join(settings.repo, '/.git')} `
        + `log --follow --oneline --pretty=format:"%H" `
        + `${settings.limits.since? `--since="${settings.limits.since}" ` : ''}`
        + `${settings.limits.until? `--until="${settings.limits.until}" ` : ''}`
        + `${settings.limits.author? `--author="${settings.limits.author}" ` : ''}`
        + `-- ${file.replace(/(?=[() ])/g, '\\')}`
    }
    
    let getIncludedCommits = (sinceHash, untilHash) => {
        let includedCommits = execSync(
        `git --git-dir ${path.join(settings.repo, '/.git')} `
        + `log --oneline --pretty=format:"%H" `)
        .toString()
        .trim().split(/\r?\n/)
        let includedCommitsShort = includedCommits.map(commit => commit.slice(0, 7))
        
        let sinceCommitIndex = includedCommits.indexOf(sinceHash) >= 0?
        includedCommits.indexOf(sinceHash)
        : includedCommitsShort.indexOf(sinceHash)
        let untilCommitIndex = includedCommits.indexOf(untilHash) >= 0?
        includedCommits.indexOf(untilHash)
        : includedCommitsShort.indexOf(untilHash)
        
        if (sinceHash !== undefined && sinceCommitIndex < 0) {
            throw new Error(`--since-commit - commit ${sinceHash} not found.`)
        }
        if (untilHash !== undefined && untilCommitIndex < 0)
        {
            throw new Error(`--until-commit - commit ${untilHash} not found.`)
        }
        if (sinceHash !== undefined && untilHash !== undefined
        && sinceCommitIndex < untilCommitIndex) {
            throw new Error('--since-commit hash appears to be made later than --until-commit hash; you should swap them.')
        }
        
        if (sinceHash !== undefined) {
            includedCommits = includedCommits.splice(0, sinceCommitIndex + 1)
        }
        if (untilHash !== undefined) {
            includedCommits = includedCommits.splice(untilCommitIndex, includedCommits.length)
        }

        includedCommitsShort = includedCommits.map(commit => commit.slice(0, 7))
        
        return {
            commits: includedCommits,
            commitsShort: includedCommitsShort
        }
    }
    
    let isIncluded = (commit) => {
        if (settings.limits.sinceCommit !== undefined
        || settings.limits.untilCommit !== undefined) {
            this.includedCommits = this.includedCommits || getIncludedCommits(settings.limits.sinceCommit, settings.limits.untilCommit)
            
            return this.includedCommits.commits.includes(commit)
            || this.includedCommits.commitsShort.includes(commit)
        }
        else {
            return true
        } 
    }
    
    
    
    let execGit = (file, index, resolve, reject) => {
        tokens.get((err, token) => {
            logger.verbose(`file #${index}, thread #${token} - started reading file: ${file}`)
            
            exec(getGitCommand(file), (err, stdout, stderr) => {
                if (err === null && stderr === '') {
                    let commits = stdout !== ''?
                    stdout.trim().split(/\r?\n/).filter(commit => isIncluded(commit))
                    : ""
                    
                    if(commits.length > 0) {
                        logger.verbose(`file #${index}, thread #${token} - finished reading file: ${commits.length} changes ${file}`)
                        
                        tokens.put(token)
                        
                        logger.tickBar()
                        
                        resolve({
                            file,
                            count: commits.length
                        })
                    }
                    else {
                        logger.verbose(`finished reading file: ${commits.length} changes ${file}`)
                        logger.verbose(`file #${index}, thread #${token}`)
                        
                        tokens.put(token)
                        
                        logger.tickBar()
                        
                        resolve()
                    }
                }
                else {
                    tokens.put(token)                            
                    
                    reject(err)                    
                }
            })
        })
    }
    
    for (let i = 0; i < settings.threads; i++) {
        tokens.put(i)
    }
    
    logger.verbose(`getting file logs...`)
    logger.verbose(`using command: ${getGitCommand('<file>')}`)
    if (settings.displayProgress) {
        logger.setBar(files.length)
    }
    
    files = files.map(function(file, index) {
        return new Promise((resolve, reject) => execGit(file, index, resolve, reject))
    })
    
    return files
}

module.exports = getFileLogs