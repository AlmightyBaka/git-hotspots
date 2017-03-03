const gitCounter = require("./gitCounter.js");

let listPrint = function (repoDir, amount = 10, verbose = false) {
    gitCounter.getHotspots(repoDir, (filename, count) => {
        console.log(filename + ": " + count + " commits");
    }, amount, verbose);
};

module.exports.listPrint = listPrint;