const execSync = require('child_process').execSync,
path = require('path')

let getIncludedCommits = (repo, sinceHash, untilHash) => {
    this.sinceHash = sinceHash
    this.untilHash = untilHash
    
    if (this.sinceHash !== undefined
    || this.untilHash !== undefined) {
        console.log('ran')
        let includedCommits = execSync(
        `git --git-dir ${path.join(repo, '/.git')} `
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
        
        this.includedCommits = includedCommits,
        this.includedCommitsShort = includedCommitsShort
    }
    
    return isIncluded
}

let isIncluded = (commit) => {
    if (this.sinceHash !== undefined
    || this.untilHash !== undefined) {
        return this.includedCommits.includes(commit)
        || this.includedCommitsShort.includes(commit)
    }
    else {
        return true
    } 
}

module.exports = getIncludedCommits