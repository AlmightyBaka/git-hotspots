const gitCounter = require("./gitCounter.js");
const align = require('string-align');

let listPrint = function (repoDir, amount = 10, verbose = false) {
    console.log(`${align("commits", 10, 'left')}   ${align("filename", 30, 'left')}\n`);

    gitCounter.getHotspots(repoDir, (filename, count) => {
        console.log(`${align(count, 10, 'left')}   ${align(filename, 30, 'left')}`);
    }, amount, verbose);
};

module.exports.listPrint = listPrint;