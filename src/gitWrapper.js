const align = require('string-align'),
colors = require('ansi-256-colors')

const GitHotspots = require('./gitHotspots.js')

let listPrint = function ({
    repo = '.',
    limits = {
        amount: 10,
        include: '',
        exclude: '',
        since: '',
        until: '',
        author: '',
    },
    verbose = false,
    threads = 250,
    displayProgress = false
}) {
    new GitHotspots({
        repo,
        limits,
        verbose,
        threads,
        displayProgress
    })
    .getHotspots()
    .then(filesCount => {
        if (!verbose) {
            process.stdout.moveCursor(0, -1, 0)
            process.stdout.clearLine(0, 0, 0, 0)
        }
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