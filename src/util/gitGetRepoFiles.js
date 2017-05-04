const exec = require('child_process').exec,
path = require('path')

const logger = require('./logger.js')

let getRepoFiles = function (repo) {
    return new Promise((resolve, reject) => {
        logger.verbose(`getting repository files...`)
        
        exec(`git --git-dir ${path.join(repo, '/.git')} ls-files`,
        (err, stdout, stderr) => {
            if (err == null && stderr == '') {
                let files = stdout.trim().split(/\r?\n/)
                
                logger.verbose(`total file count: ${files.length}`)
                
                resolve(files)
            }
            else {
                reject(err)                    
            }
        })
    })
}

module.exports = getRepoFiles