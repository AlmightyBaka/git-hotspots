const git = require("nodegit"),
path = require("path"),
git_kit = require("nodegit-kit");

let getDiffs = function (repoDir, callback) {
  let getDiffIterator = function(repo, log) {
    return function* diffIterator() {
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
    };
  };

  let getTuple = function(repo, log) {
    return {
      diffIterator: getDiffIterator(repo, log),
      length: log.length
    };
  }
  
  let iterateDiffs = function (result, resolve) {
    function finishedClosure(max) {
      let count = 0;
      let all = max;
      
      return function increment() {
        count++;
        if (count === max - 1) {
          resolve();
        }
      };
    }
    
    let diffIterator = result.diffIterator;
    let length = result.length;
    let finished = finishedClosure(length);
    
    for (let diffsPromise of diffIterator()) {
      diffsPromise.then((diffs) => 
        diffs.forEach((diff) => 
          callback(diff)
        )
      )
      .then(() => finished());
    }
  };
  
  return new Promise(function (resolve, reject) {
    git.Repository.open(path.resolve(repoDir))
    .then((repo) => {
      // return repo.getBranchCommit("master");
      return git_kit.log(repo)
      .then((log) => getTuple(repo, log))
      .then((result) => iterateDiffs(result, resolve));
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  });
};

module.exports.getDiffs = getDiffs;