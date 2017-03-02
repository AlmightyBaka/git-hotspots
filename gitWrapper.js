const gitParser = require("./gitParser.js")

const defRepoDir = ".git",
      bigRepoPath = "../nodegit/.git";

let list = function (repoDir, amount = 10, verbose = false) {
    let files = {};
    let tuples = [];

    gitParser.getDiffs(repoDir, function (commit) {
        if (files[commit.path] === undefined) {
            files[commit.path] = 1;
        }
        else {
            files[commit.path] += 1;
        }
    })
    .then(function() {
        const fs = require('fs');

        for (let path in files) {
            tuples.push([path, files[path]])
        }

        tuples.sort(function (a, b) {
            a = a[1];
            b = b[1];

            return a < b ? -1 : (a > b ? 1 : 0);
        })
        .reverse();

        for (let i = 0; i <= amount; i++) {
            if (i === tuples.length) {
                return;
            }

            if (fs.existsSync(tuples[i][0])) {
                // TODO: colored output
                console.log(tuples[i][0] + ": " + tuples[i][1] + " commits");
            }
        }
    });
};

module.exports.list = list;