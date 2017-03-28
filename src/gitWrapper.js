const GitHotspots = require("./gitHotspots.js");
const align = require('string-align');

let listPrint = function (repo, amount = 10, verbose = false) {
    // TODO: colored output
    // TODO: select only last n days
    let hotspots = new GitHotspots();
    
    console.log(`${align("commits", 10, 'left')}   ${align("filename", 30, 'left')}\n`);
    
    hotspots.setRepo(repo)
    .getHotspots((filename, count) => {
        console.log(`${align(count, 10, 'left')}   ${align(filename, 30, 'left')}`);
    });
};

module.exports.listPrint = listPrint;