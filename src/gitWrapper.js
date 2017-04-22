const align = require('string-align'),
colors = require('ansi-256-colors');

const GitHotspots = require("./gitHotspots.js");

let listPrint = function (repo, amount = 10, verbose = 'info') {
    new GitHotspots()
    .setRepo(repo)
    .setAmount(amount)
    .setLogLevel(verbose)
    .getHotspots((filesCount) => {
        console.log(`${align("commits", 10, 'left')}   ${align("filename", 30, 'left')}`);
        let yellow = 0;
        let colorIndex = -1;

        filesCount.forEach(function(fileCount, index) {
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