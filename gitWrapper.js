const gitCore = require("./gitCore.js")

const defRepoDir = ".git",
      bigRepoPath = "../nodegit/.git";

let list = function (repoDir, amount = 10, verbose = false) {
    let files = {};
    let tuples = [];

    gitCore.getDiffs(repoDir, function (commit) {
        // console.log(commit.path);
        // console.log(commit);        
        // console.log("\n\n\n\n\n")
                
        if (files[commit.path] === undefined) {
            files[commit.path] = 1;
            // console.log(files[commit.path])
        }
        else {
            files[commit.path] += 1;
            // console.log(files[commit.path])            
        }
    })
    .then(function() {
        // console.log(files)

        for (let path in files) {
            tuples.push([path, files[path]])
        }

        tuples.sort(function (a, b) {
            a = a[1];
            b = b[1];

            return a < b ? -1 : (a > b ? 1 : 0);
        })
        .reverse();

        // console.log(tuples)

        for (let i = 0; i <= amount; i++) {
            const fs = require('fs');

            if (fs.existsSync(tuples[i][0])) {
                console.log(tuples[i][0] + ": " + tuples[i][1] + " commits");
            }
        }
    });
};

module.exports.list = list;