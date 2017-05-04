const exec = require('child_process').exec,
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
    
    let isCommitIncluded = require('./gitIsCommitIncluded.js')(settings.repo, settings.limits.sinceCommit, settings.limits.untilCommit)
    
    let execGit = (file, index, resolve, reject) => {
        tokens.get((err, token) => {
            logger.verbose(`file #${index}, thread #${token} - started reading file: ${file}`)
            
            exec(getGitCommand(file), (err, stdout, stderr) => {
                if (err === null && stderr === '') {
                    let commits = stdout !== ''?
                    stdout.trim().split(/\r?\n/).filter(commit => isCommitIncluded(commit))
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