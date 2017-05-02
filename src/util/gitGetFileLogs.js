const exec = require('child_process').exec,
path = require('path')

const gochan = require('gochan')

const logger = require('./logger.js')

const tokens = gochan()

let getFileLogs = function(files, settings) {
    let getGitCommand = (file) => {
        return `git --git-dir ${path.join(settings.repo, '/.git')} `
        + `log --follow --oneline --pretty=format:"%h" `
        + `${settings.limits.since? `--since="${settings.limits.since}" ` : ''}`
        + `${settings.limits.until? `--until="${settings.limits.until}" ` : ''}`
        + `${settings.limits.author? `--author="${settings.limits.author}" ` : ''}`
        + `-- ${file.replace(/(?=[() ])/g, '\\')}`
    }
    
    logger.verbose(`getting file logs...`)
    logger.verbose(`using command: ${getGitCommand('<file>')}`)
    if (settings.displayProgress) {
        logger.setBar(files.length)
    }
    
    let execGit = (file, index, resolve, reject) => {
        tokens.get((err, token) => {
            logger.verbose(`file #${index}, thread #${token} - started reading file: ${file}`)
            
            exec(getGitCommand(file),
            (err, stdout, stderr) => {
                if (err === null && stderr === '') {
                    let count = stdout.trim().split(/\r?\n/).length
                    
                    if(stdout !== '') {
                        logger.verbose(`file #${index}, thread #${token} - finished reading file: ${count} changes ${file}`)
                        
                        tokens.put(token)
                        
                        logger.tickBar()
                        
                        resolve({
                            file,
                            count
                        })
                    }
                    else {
                        logger.verbose(`finished reading file: ${count} changes ${file}`)
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
    
    files = files.map(function(file, index) {
        return new Promise((resolve, reject) => execGit(file, index, resolve, reject))
    })
    
    return files
}

module.exports = getFileLogs