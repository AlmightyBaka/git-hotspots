let nodegit = require("nodegit"),
  path = require("path");

let repoPath = ".git";
let dictionary = {};

nodegit.Repository.open(path.resolve(repoPath))
  .then(function (repo) {
    return repo.getMasterCommit();
  })
  .then(function (firstCommitOnMaster) {
    return firstCommitOnMaster.getTree();
  })
  .then(function (tree) {
    // `walk()` returns an event.
    let walker = tree.walk();
    
    walker.on("entry", function (entry) {
      if (dictionary[entry.path()] == undefined) {
        dictionary[entry.path()] = 0;
      }

      dictionary[entry.path()] += 1;
    });

    // Don't forget to call `start()`!
    walker.start();
  })
  .then(function () {
    for (let key in dictionary) {
      console.log(key + ": " + dictionary[key] + " updates");
    }
  })
.done();

