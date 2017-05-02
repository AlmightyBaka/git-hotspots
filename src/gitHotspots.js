const gitCounter = require('./util/gitCounter.js'),
logger = require('./util/logger.js'),
defineProperty = require('./util/defineProperty.js')

class GitHotspots{
    /**
    * @namespace
    * @property {object}  settings           - Settings object.
    * @property {string}  settings.repo      - Repository's directory.
    * @property {string}  settings.include   - Regex to include files.
    * @property {string}  settings.exclude   - Regex to exclude files.
    * @property {number}  settings.amount    - Amount of files to be shown.
    * @property {number}  settings.threads   - Maximum amount of threads running concurrently.
    * @property {boolean} settings.verbose   - Sets verbose output.
    * @property {string}  settings.since     - Limit the commits to those made after the specified date.
    * @property {string}  settings.until     - Limit the commits to those made before the specified date.
    * @property {string}  settings.author    - Only show commits in which the author entry matches the specified string.
    * @property {string}  settings.displayProgress   - Shows progress bar if true.
    */
    constructor(settings) {
        settings = settings || {}
        
        defineProperty(settings, 'repo', settings.repo, '.', 'string')
        defineProperty(settings, 'include', settings.include, undefined, 'string')
        defineProperty(settings, 'exclude', settings.repo, undefined, 'string')
        defineProperty(settings, 'amount', settings.amount, 10, 'number')
        defineProperty(settings, 'threads', settings.amount, 250, 'number')
        defineProperty(settings, 'verbose', settings.verbose, false, 'boolean')
        defineProperty(settings, 'since', settings.since, undefined, 'string')
        defineProperty(settings, 'until', settings.until, undefined, 'string')
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
        this.settings.amount = amount
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
    
    setSince(since) {
        this.settings.since = since
        return this
    }
    
    setUntil(until) {
        this.settings.until = until
        return this
    }
    
    setAuthor(author) {
        this.settings.author = author
        return this
    }
    
    getHotspots() {
        return new Promise((resolve, reject) =>
        gitCounter(this.settings, resolve, reject))
    }
}

module.exports = GitHotspots