const gitParser = require("./gitParser.js");

const defRepoDir = ".git",
bigRepoPath = "../nodegit/.git";

let getHotspots = function (repoDir, callback, amount = 10, verbose = false) {
    let files = {};
    
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
        
        for (let file in files) {
            tuples.push({
                file,
                count: files[file]
            });
        }
        
        tuples.sort(function (a, b) {
            a = a.count;
            b = b.count;
            
            return a < b ? -1 : (a > b ? 1 : 0);
        })
        .reverse();
        
        return tuples;
    };
    
    let runCallbacks = function(tuples) {
        const fs = require('fs');
        
        for (let i = 0; i < amount; i++) {
            // BUG: file not found if filename was changed via git mv
            // if (fs.existsSync(tuples[i].file)) {
            //     callback(tuples[i].file, tuples[i].count);
            // }
            if (i < tuples.length) {
                callback(tuples[i].file, tuples[i].count);
            }
            else {
                return;
            }
        }
    };
    
    gitParser.getDiffs(repoDir, countFiles())
    .then(() => mapToTuples())
    .then((tuples) => runCallbacks(tuples));
};

module.exports.getHotspots = getHotspots;