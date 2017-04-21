const gochan = require('gochan');

const simpleGit = require('simple-git'),
getRepoFiles = require('./gitGetRepoFiles.js'),
logger = require('./logger.js').get();

let getHotspots = function (settings, callback) {
    let getFileLogs = function(files) {
        const git = simpleGit(settings.repo);
        const exec = require('child_process').exec;
        const tokens = gochan();
        
        for (var i = 0; i < 250; i++) {
            tokens.put(i)
        }
        
        files = files.map(function(file, index) {
            return new Promise((resolve, reject) => {
                tokens.get((err, token) => {
                    logger.verbose(token, ' started reading file: ', file)
                    
                    exec('git --git-dir ' + settings.repo + '/.git log --follow --oneline -- ' + file,
                    (err, stdout, stderr) => {
                        if (err == null && stderr == "") {
                            let count = stdout.trim().split(/\r?\n/).length;
                            
                            logger.verbose(`finished reading file: ${count} ${file}`)
                            logger.verbose(`index: ${index}, token: ${token}\n`)
                            
                            tokens.put(token)
                            
                            resolve({
                                file,
                                count
                            });
                        }
                        else {
                            logger.error(err)
                            logger.error(stderr)
                            
                            tokens.put(token)                            
                            
                            if (err == null) {
                                reject(stderr)
                            }
                            else {
                                reject(err);                    
                            }
                        }
                    });
                })
            })
        });
        
        logger.verbose('total files count: ', files.length)
        return files;
    }
    
    let resolveFiles = async function(filesPromises) {
        return Promise.all(filesPromises)
    }
    
    let sortFiles = function(filesCount) {
        filesCount.sort(function (a, b) {
            a = a.count;
            b = b.count;
            
            return a > b ? -1 : (a < b ? 1 : 0);
        });
        
        return filesCount;
    }
    
    let runCallbacks = function(filesCount) {
        if (settings.amount !== null) {
            filesCount.splice(settings.amount, filesCount.length - settings.amount);
        }
        
        callback(filesCount);
    }
    
    getRepoFiles(settings.repo)
    .then((files) => getFileLogs(files))
    .then((filesPromises) => resolveFiles(filesPromises))
    .then((filesCount) => sortFiles(filesCount))
    .then((filesCount) => runCallbacks(filesCount))
};

module.exports = getHotspots;