let git = require("nodegit"),
    path = require("path"),
    git_kit = require("nodegit-kit");

let repoPath = ".git",
    bigRepoPath = "../nodegit/.git",
    dictionary = {};

git.Repository.open(path.resolve(repoPath))
  .then(function (repo) {
    // return repo.getBranchCommit("master");
    return git_kit.log(repo)
    .then(function (history) {
      console.log("log:\n");
      console.log(history);
      console.log("\n\n");

      return history;
    })
    .then(function (history) {
      function* diffsIterator() {
        for (let i = 0; i < history.length; i++) {
          // gets diff from working tree not from last commit
          yield git_kit.diff(repo, history[i].commit);
        }
      }
      
      return diffsIterator;
    })
    .then(function (diffsIterator) {
      for (let diffs of diffsIterator()) {
        diffs.then(function (diffs) {
          diffs.forEach(function(diff) {
            console.log(diff.path);
          });

          console.log("");
        });
      }
    });
  })
.done(function () {
  setTimeout(function () {
      for (let key in dictionary) {
        console.log(key + ": " + dictionary[key] + " updates");
      }
    }, 1000);
});

