const align = require('string-align');

const GitHotspots = require("./gitHotspots.js");

let listPrint = function (repo, amount = 10, verbose = false) {
    // TODO: colored output
    // TODO: select only last n days
    console.log(`${align("commits", 10, 'left')}   ${align("filename", 30, 'left')}`);

    new GitHotspots()
    .setRepo(repo)
    .setAmount(amount)
    .setLogLevel(verbose ? 'verbose' : 'info')
    .getHotspots((filename, count) => {
        console.log(`${align(count, 10, 'left')}   ${align(filename, 30, 'left')}`);
    });
};

module.exports.listPrint = listPrint;