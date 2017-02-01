const git = require("nodegit"),
      path = require("path"),
      git_kit = require("nodegit-kit");

let getDiffs = function (repoDir, callback) {
  git.Repository.open(path.resolve(repoDir))
    .then(function (repo) {
      // return repo.getBranchCommit("master");
      return git_kit.log(repo)
        // .then(function (history) {
        //   console.log("log:\n");
        //   console.log(history);
        //   console.log("\n\n");

        //   return history;
        // })
        .then(function (history) {
          function* diffsIterator() {
            for (let i = 0; i < history.length; i++) {
              let commitFrom,
                commitTo;

              commitFrom = history[i].commit;
              if (history[i + 1] !== undefined) {
                commitTo = history[i + 1].commit;
              }

              if (commitTo !== undefined) {
                yield git_kit.diff(repo, commitFrom, commitTo);
              }
              else {
                // TODO: get files for first commit
                return;
              }
            }
          }

          return diffsIterator;
        })
        .then(function (diffsIterator) {
          for (let diffs of diffsIterator()) {
            diffs.then(function (diffs) {
              diffs.forEach(function (diff) {
                // TODO: check for status: 'deleted'
                callback(diff);
              });

              console.log("");
            });
          }
        });
    });
};

module.exports.getDiffs = getDiffs;