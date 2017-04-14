const simpleGit = require('simple-git');

let getRepoFiles = function (repoDir) {
    const git = simpleGit(repoDir);
    
    return new Promise((resolve, reject) => {
        git.raw(
        ['--git-dir',
        repoDir + '/.git',
        'ls-files']
        , (err, result) => {
            if (err == null) {
                let files = result.trim().split(/\r?\n/);
                resolve(files);
            }
            else {
                return reject(err);
            }
        });
    });
}

module.exports = getRepoFiles;