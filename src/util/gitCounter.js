const getRepoFiles = require('./gitGetRepoFiles.js'),
getFileLogs = require('./gitGetFileLogs.js'),
logger = require('./logger.js').get();

let getHotspots = function (settings, callback) {
    let resolveFiles = function(filesPromises) {
        return Promise.all(filesPromises)
    }
    
    let sortFiles = function(filesCount) {
        filesCount.sort(function (a, b) {
            a = a.count
            b = b.count
            
            return a > b ? -1 : (a < b ? 1 : 0)
        })
        
        return filesCount
    }
    
    let runCallbacks = function(filesCount) {
        if (settings.amount !== null) {
            filesCount.splice(settings.amount, filesCount.length - settings.amount)
        }
        
        callback(filesCount)
    }
    
    getRepoFiles(settings.repo)
    .then((files) => getFileLogs(settings.repo, settings.threads, files))
    .then((filesPromises) => resolveFiles(filesPromises))
    .then((filesCount) => sortFiles(filesCount))
    .then((filesCount) => runCallbacks(filesCount))
    .catch((error) => {
        logger.error(error)
    })
}

module.exports = getHotspots