const exec = require('child_process').exec

const gochan = require('gochan'),
ProgressBar = require('progress')

const logger = require('./logger.js').get()

const tokens = gochan()

let getFileLogs = function(files, settings) {
    logger.verbose(`getting file logs...`)
    const bar = new ProgressBar('processing: [:bar] :percent ETA: :etas', {
        total: files.length,
        width: 20
    })
    
    let execGit = (file, index, resolve, reject) => {
        tokens.get((err, token) => {
            logger.verbose(`thread #${token}: started reading file: ${file}`)
            
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
                        logger.verbose(`finished reading file: ${count} changes ${file}`)
                        logger.verbose(`file #${index}, thread #${token}\n`)
                        
                        tokens.put(token)

                        bar.tick()
                        
                        resolve({
                            file,
                            count
                        })
                    }
                    else {
                        logger.verbose(`finished reading file: ${count} changes ${file}`)
                        logger.verbose(`file #${index}, thread #${token}\n`)
                        
                        tokens.put(token)

                        bar.tick()

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
    
    logger.verbose(`total files count: ${files.length}`)
    
    return files
}

module.exports = getFileLogs