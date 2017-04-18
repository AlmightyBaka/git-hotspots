const gochan = require('gochan')

const simpleGit = require('simple-git'),
getRepoFiles = require('./getRepoFiles.js');

const defRepoDir = ".git";

let getHotspots = function (repoDir, callback, amount = 10, verbose = false) {
    let getFileLogs = function(files) {
        const git = simpleGit(repoDir);
        const exec = require('child_process').exec;
        const tokens = gochan();
        
        for (var i = 0; i < 250; i++) {
            tokens.put(i)
        }
        
        files = files.map(function(file, index) {
            return new Promise((resolve, reject) => {
                tokens.get((err, token) => {
                    console.log(token, ' started reading file: ', file)
                    
                    exec('git --git-dir ' + repoDir + '/.git log --follow --oneline -- ' + file,
                    (err, stdout, stderr) => {
                        if (err == null && stderr == "") {
                            console.log("finished reading file: " + stdout.trim().split(/\r?\n/).length + ' ' + file)
                            console.log(`index: ${index}, token: ${token}`)
                            console.log("\n")
                            
                            tokens.put(token)
                            
                            resolve({
                                file,
                                count: stdout.trim().split(/\r?\n/).length
                            });
                        }
                        else {
                            console.log(err)
                            console.log(stderr)
                            
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
        
        console.log('total files count: ', files.length)
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