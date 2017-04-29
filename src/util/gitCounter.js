const getRepoFiles = require('./gitGetRepoFiles.js'),
getFileLogs = require('./gitGetFileLogs.js')

let getHotspots = function (settings, resolve, reject) {
    let resolveFilePromises = function(filesPromises) {
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
    
    let spliceFiles = function(filesCount) {
        if (settings.amount !== null) {
            filesCount.splice(settings.amount, filesCount.length - settings.amount)
        }

        return filesCount
    }
    
    getRepoFiles(settings.repo)
    .then(files => getFileLogs(files, settings))
    .then(filesPromises => resolveFilePromises(filesPromises))
    .then(filesCount => sortFiles(filesCount))
    .then(filesCount => spliceFiles(filesCount))
    .then(filesCount => resolve(filesCount))
    .catch(error => reject(error))
}

module.exports = getHotspots