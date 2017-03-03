const gitParser = require("./gitParser.js")

const defRepoDir = ".git",
bigRepoPath = "../nodegit/.git";

let getHotspots = function (repoDir, callback, amount = 10, verbose = false) {
    let countFiles = function () {
        return function(commit) {
            if (files[commit.path] === undefined) {
                files[commit.path] = 1;
            }
            else {
                files[commit.path] += 1;
            }
        };
    };
    
    let mapToTuples = function() {
        let tuples = [];
        
        for (let path in files) {
            tuples.push([path, files[path]]);
        }
        
        tuples.sort(function (a, b) {
            a = a[1];
            b = b[1];
            
            return a < b ? -1 : (a > b ? 1 : 0);
        })
        .reverse();
        
        return tuples;
    };

    let runCallbacks = function(tuples) {
        const fs = require('fs')
        
        for (let i = 0; i <= amount; i++) {
            if (i === tuples.length) {
                return;
            }
            
            if (fs.existsSync(tuples[i][0])) {
                // TODO: colored output
                callback(tuples[i][0], tuples[i][1])
            }
        }
    };
    
    let files = {};
    
    gitParser.getDiffs(repoDir, countFiles())
    .then((files) => mapToTuples(files))
    .then((tuples) => runCallbacks(tuples));
};

module.exports.getHotspots = getHotspots;