const exec = require('child_process').exec,
gochan = require('gochan')

const logger = require('./logger.js').get()

const tokens = gochan()

let getFileLogs = function(repo, threads, files) {
    logger.verbose(`getting file logs...`)

    let execGit = (file, index, resolve, reject) => {
        tokens.get((err, token) => {
            logger.verbose(`thread #${token}: started reading file: ${file}`)
            
            exec(`git --git-dir ${repo}/.git log --follow --oneline -- ${file}`,
            (err, stdout, stderr) => {
                if (err == null && stderr == "") {
                    let count = stdout.trim().split(/\r?\n/).length
                    
                    logger.verbose(`finished reading file: ${count} changes ${file}`)
                    logger.verbose(`file #${index}, thread #${token}\n`)
                    
                    tokens.put(token)
                    
                    resolve({
                        file,
                        count
                    })
                }
                else {
                    logger.error(err)
                    logger.error(stderr)
                    
                    tokens.put(token)                            
                    
                    if (err == null) {
                        reject(stderr)
                    }
                    else {
                        reject(err)                    
                    }
                }
            })
        })
    }
    
    for (let i = 0; i < threads; i++) {
        tokens.put(i)
    }
    
    files = files.map(function(file, index) {
        return new Promise((resolve, reject) => execGit(file, index, resolve, reject))
    })
    
    logger.verbose(`total files count: ${files.length}`)
    
    return files
}

module.exports = getFileLogs