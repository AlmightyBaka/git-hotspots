const minimatch = require("minimatch")

const getRepoFiles = require('./gitGetRepoFiles.js'),
getFileLogs = require('./gitGetFileLogs.js')

let getHotspots = function (settings, resolve, reject) {
    let filterFiles = function(files) {
        if (settings.limits.exclude !== undefined) {
            files = files.filter(file => {
                return !minimatch(file, settings.limits.exclude)
            })
        }
        if (settings.limits.include !== undefined) {
            files = files.filter(file => {
                return minimatch(file, settings.limits.include)
            })
        }
        
        return files
    }
    
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
        if (settings.limits.amount !== undefined) {
            filesCount.splice(settings.limits.amount, filesCount.length - settings.limits.amount)
        }
        
        return filesCount
    }
    
    let filterUndefined = function (filesCount) {
        filesCount = filesCount.filter(element => element !== undefined)
        
        return filesCount;
    }
    
    getRepoFiles(settings.repo)
    .then(files => filterFiles(files))
    .then(files => getFileLogs(files, settings))
    .then(filesPromises => resolveFilePromises(filesPromises))
    .then(filesCount => sortFiles(filesCount))
    .then(filesCount => spliceFiles(filesCount))
    .then(filesCount => filterUndefined(filesCount))
    .then(filesCount => resolve(filesCount))
    .catch(error => reject(error))
}

module.exports = getHotspots