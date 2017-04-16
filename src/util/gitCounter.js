const simpleGit = require('simple-git'),
getRepoFiles = require('./getRepoFiles.js');

const defRepoDir = ".git";

let getHotspots = function (repoDir, callback, amount = 10, verbose = false) {
    let getFileLogs = function(files) {
        const git = simpleGit(repoDir);
        
        files = files.map(function(file) {
            return new Promise((resolve, reject) => {
                git.raw(
                ['log',
                '--follow',
                '--oneline',
                '--',
                file],
                (err, result) => {
                    if (err == null) {
                        resolve({
                            file,
                            count: result.trim().split(/\r?\n/).length
                        });
                    }
                    else {
                        reject(err);                    
                    }
                });
            })
        });

        return files;
    }

    let resolveFiles = function(filesPromises) {
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
        for (let i = 0; i < amount; i++) {
            if (i < filesCount.length) {
                callback(filesCount[i].file, filesCount[i].count);
            }
            else {
                return;
            }
        }
    }
    
    getRepoFiles(repoDir)
    .then((files) => getFileLogs(files))
    .then((filesPromises) => resolveFiles(filesPromises))
    .then((filesCount) => sortFiles(filesCount))
    .then((filesCount) => runCallbacks(filesCount))
};

module.exports = getHotspots;