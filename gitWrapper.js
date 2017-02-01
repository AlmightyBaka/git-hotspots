const gitCore = require("./gitCore.js")

const defRepoDir = ".git",
      bigRepoPath = "../nodegit/.git";

let getAll = function (repoDir, amount = 10, verbose = false) {
    gitCore.getDiffs(repoDir, function (diff) {
        console.log(diff.path);
    })
}

module.exports.getAll = getAll;