const align = require('string-align'),
    colors = require('ansi-256-colors');

const GitHotspots = require("./gitHotspots.js");

let listPrint = function (repo, amount = 10, logLevel = 'info', threads = 250) {
    new GitHotspots()
    .setRepo(repo)
    .setAmount(amount)
    .setThreads(threads)
    .setLogLevel(logLevel)
    .getHotspots((filesCount) => {
        console.log(`${align("commits", 10, 'left')}   ${align("filename", 30, 'left')}`);

        let [yellow, colorIndex] = [0, -1];

        filesCount.forEach(function(fileCount) {
            colorIndex++;
            if (colorIndex == Math.floor(filesCount.length / 5)) {
                yellow++;
                colorIndex = -1;
            }

            console.log(`${colors.fg.getRgb(5, yellow, 0)}${align(fileCount.count, 10, 'left')}   ${align(fileCount.file, 30, 'left')}${colors.reset}`);
        });
    });
};

module.exports.listPrint = listPrint;