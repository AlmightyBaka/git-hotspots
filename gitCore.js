const git = require("nodegit"),
  path = require("path"),
  git_kit = require("nodegit-kit");

let getDiffs = function (repoDir, callback) {
  return new Promise(function (resolve, reject) {
    git.Repository.open(path.resolve(repoDir))
      .then(function (repo) {
        // return repo.getBranchCommit("master");
        return git_kit.log(repo)
          .then(function (log) {
            // console.log("log:\n");
            // console.log(log);
            // console.log("\n\n");

            return log;
          })
          .then(function (log) {
            function* diffIterator() {
              for (let i = 0; i < log.length; i++) {
                let commitFrom,
                  commitTo;

                commitFrom = log[i].commit;
                if (log[i + 1] !== undefined) {
                  commitTo = log[i + 1].commit;
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

            return {
              diffIterator: diffIterator,
              length: log.length
            };
          })
          .then(function (result) {
            function finishedClosure(max) {
              let count = 0;
              let all = max;

              function increment() {
                count++;
                if (count == max - 1) {
                  resolve();
                }
              }

              return increment;
            }

            let diffIterator = result.diffIterator;
            let length = result.length;
            let finished = finishedClosure(length);

            for (let diffs of diffIterator()) {
              diffs.then(function (diffs) {
                diffs.forEach(function (diff) {
                  // TODO: check for status: 'deleted'
                  if (diff.status !== 'deleted') {
                    callback(diff);
                  }
                });
              })
              .then(function() {
                finished();
              });
            }

          });
      })
      .catch(function () {
        reject();
      });
  });
};

module.exports.getDiffs = getDiffs;