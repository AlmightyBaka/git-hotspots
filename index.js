let git = require("nodegit"),
    path = require("path"),
    git_kit = require("nodegit-kit");

let repoPath = ".git";
let dictionary = {};

git.Repository.open(path.resolve(repoPath))
  .then(function (repo) {
    // return repo.getBranchCommit("master");
    return git_kit.log(repo)
    .then(function (log) {
      console.log("log:\n");
      console.log(log);
      console.log("\n\n");

      return log[0].commit;
    })
    .then(function (commit) {
      return git_kit.diff(repo, commit);
    })
    .then(function (diff) {
      console.log(diff);
    });
  })
.done(function () {
  setTimeout(function () {
      for (let key in dictionary) {
        console.log(key + ": " + dictionary[key] + " updates");
      }
    }, 1000);
});

