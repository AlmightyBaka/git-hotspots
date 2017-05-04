const gitCounter = require('./util/git/gitCounter.js'),
logger = require('./util/logger.js'),
defineProperty = require('./util/defineProperty.js')

class GitHotspots{
    /**
    * @namespace
    * @property {object}  settings           - Settings object.
    * @property {string}  settings.repo      - Repository's directory.
    * @property {object}  settings.limits    - Object holding variables for limiting the output.
    * @property {number}  settings.limits.amount      - Amount of files to be shown.
    * @property {string}  settings.limits.include     - Regex to include files.
    * @property {string}  settings.limits.exclude     - Regex to exclude files.
    * @property {string}  settings.limits.since       - Limit the commits to those made after the specified date.
    * @property {string}  settings.limits.sinceCommit - Limit the commits to those made after the specified commit hash.
    * @property {string}  settings.limits.until       - Limit the commits to those made before the specified date.
    * @property {string}  settings.limits.untilCommit - Limit the commits to those made before the specified commit hash.
    * @property {string}  settings.limits.author    - Only show commits in which the author entry matches the specified string.
    * @property {number}  settings.threads   - Maximum amount of threads running concurrently.
    * @property {boolean} settings.verbose   - Sets verbose output.
    * @property {string}  settings.displayProgress   - Shows progress bar if true.
    */
    constructor(settings) {
        settings = settings || {}
        settings.limits = settings.limits || {}
        
        defineProperty(settings, 'repo', settings.repo, '.', 'string')
        defineProperty(settings.limits, 'amount', settings.limits, 10, 'number')
        defineProperty(settings.limits, 'include', settings.limits, undefined, 'string')
        defineProperty(settings.limits, 'exclude', settings.limits, undefined, 'string')
        defineProperty(settings.limits, 'since', settings.limits, undefined, 'string')
        defineProperty(settings.limits, 'sinceCommit', settings.limits, undefined, 'string')
        defineProperty(settings.limits, 'until', settings.limits, undefined, 'string')
        defineProperty(settings.limits, 'untilCommit', settings.limits, undefined, 'string')
        defineProperty(settings, 'threads', settings.threads, 250, 'number')
        defineProperty(settings, 'verbose', settings.verbose, false, 'boolean')
        defineProperty(settings, 'author', settings.author, undefined, 'string')
        defineProperty(settings, 'displayProgress', settings.displayProgress, false, 'boolean')
        
        this.settings = settings
        
        logger.setVerbose(this.settings.verbose)
    }
    
    setRepo(dir) {
        this.settings.repo = dir
        return this
    }
    
    setAmount(amount) {
        this.settings.limits.amount = amount
        return this
    }

    setInclude(include) {
        this.settings.limits.include = include
        return this
    }

    setExclude(exclude) {
        this.settings.limits.exclude = exclude
        return this
    }
    
    setSince(since) {
        this.settings.limits.since = since
        return this
    }
    
    setSinceCommit(sinceCommit) {
        this.settings.limits.sinceCommit = sinceCommit
        return this
    }
    
    setUntil(until) {
        this.settings.limits.until = until
        return this
    }
    
    setUntilCommit(untilCommit) {
        this.settings.limits.untilCommit = untilCommit
        return this
    }
    
    setAuthor(author) {
        this.settings.limits.author = author
        return this
    }
    
    setThreads(threads) {
        this.settings.threads = threads
        return this
    }
    
    setVerbose(verbose) {
        this.settings.verbose = verbose
        logger.setVerbose(verbose)        
        
        return this
    }
    
    getHotspots() {
        return new Promise((resolve, reject) =>
        gitCounter(this.settings, resolve, reject))
    }
}

module.exports = GitHotspots