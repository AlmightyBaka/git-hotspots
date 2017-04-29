const align = require('string-align'),
colors = require('ansi-256-colors')

const GitHotspots = require('./gitHotspots.js')

let listPrint = function ({
    repo,
    amount = 10,
    logLevel = 'info',
    since = '',
    until = '',
    author = '',
    threads = 250
}) {
    new GitHotspots({
        repo,
        amount,
        logLevel,
        since,
        until,
        author,
        threads
    })
    .getHotspots()
    .then(filesCount => {
        console.log(`${align('commits', 10, 'left')}   ${align('filename', 30, 'left')}`)
        
        let [yellow, colorIndex] = [0, -1]
        
        filesCount.forEach(function(fileCount) {
            colorIndex++
            if (colorIndex == Math.floor(filesCount.length / 5)) {
                yellow++
                colorIndex = -1
            }
            
            console.log(`${colors.fg.getRgb(5, yellow, 0)}${align(fileCount.count, 10, 'left')}   ${align(fileCount.file, 30, 'left')}${colors.reset}`)
        })
    })
    .catch(error => console.log(error))
}

module.exports.listPrint = listPrint