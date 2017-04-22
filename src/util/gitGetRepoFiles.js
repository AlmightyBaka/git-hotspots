const exec = require('child_process').exec,
logger = require('./logger.js').get();

let getRepoFiles = function (repo) {
    return new Promise((resolve, reject) => {
        logger.verbose(`getting repository files...`)
        
        exec(`git --git-dir ${repo}/.git ls-files`,
        (err, stdout, stderr) => {
            if (err == null && stderr == "") {
                let files = stdout.trim().split(/\r?\n/);
                resolve(files);
            }
            else {
                logger.error(err)
                logger.error(stderr)
                
                if (err == null) {
                    reject(stderr)
                }
                else {
                    reject(err);                    
                }
            }
        });
    });
}

module.exports = getRepoFiles;