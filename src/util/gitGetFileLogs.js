const exec = require('child_process').exec

const gochan = require('gochan')

const log = require('./logger.js').get(),
logger =  require('./logger.js')

const tokens = gochan()

let getFileLogs = function(files, settings) {
    log.verbose(`getting file logs...`)
    if (settings.displayProgress) {
        logger.setBar(files.length)
    }
    
    let execGit = (file, index, resolve, reject) => {
        tokens.get((err, token) => {
            log.verbose(`thread #${token}: started reading file: ${file}`)
            
            exec(`git --git-dir ${settings.repo}/.git `
            + `log --follow --oneline --pretty=format:"%h" `
            + `${settings.since? `--since="${settings.since}" ` : ''}`
            + `${settings.until? `--until="${settings.until}" ` : ''}`
            + `${settings.author? `--author="${settings.author}" ` : ''}`
            + `-- ${file.replace(/(?=[() ])/g, '\\')}`,
            (err, stdout, stderr) => {
                if (err === null && stderr === '') {
                    let count = stdout.trim().split(/\r?\n/).length
                    
                    if(stdout !== '') {
                        log.verbose(`finished reading file: ${count} changes ${file}`)
                        log.verbose(`file #${index}, thread #${token}`)
                        
                        tokens.put(token)

                        logger.tickBar()
                        
                        resolve({
                            file,
                            count
                        })
                    }
                    else {
                        log.verbose(`finished reading file: ${count} changes ${file}`)
                        log.verbose(`file #${index}, thread #${token}`)
                        
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
    
    log.verbose(`total files count: ${files.length}`)
    
    return files
}

module.exports = getFileLogs