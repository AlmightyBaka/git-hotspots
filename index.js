let nodegit = require("nodegit"),
  path = require("path");

let repoPath = ".git";
let dictionary = {};

nodegit.Repository.open(path.resolve(repoPath))
  .then(function (repo) {
    return repo.getCurrentBranch()
    .then(function (branch) {
      return repo.getBranchCommit(branch.shorthand());
    });
  })
  .then(function (branchCommit) {
    var history = branchCommit.history(),
        promise = new Promise(function(resolve, reject) {
          history.on("end", resolve);
          history.on("error", reject);
        });
    
    history.start();

    return promise;
  })
  .then(function (commits) {
    console.log("commits count: " + commits.length)
    for (let i = 0; i < commits.length; i++) {
      var sha = commits[i].sha().substr(0,7),
          msg = commits[i].message().split('\n')[0];
      console.log(sha + " " + msg);

      commits[i].getTree().then(function (tree) {
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
      });
    }
  })
  .then(function () {
    setTimeout(function () {
      for (let key in dictionary) {
        console.log(key + ": " + dictionary[key] + " updates");
      }
    }, 1000);
  })
.done();

