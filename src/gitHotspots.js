const gitCounter = require('./util/gitCounter.js'),
logger = require('./util/logger.js')

class GitHotspots{
    /**
    * @namespace
    * @property {object}  settings           - Settings object.
    * @property {string}  settings.repo      - Repository's directory.
    * @property {string}  settings.include   - Regex to include files.
    * @property {string}  settings.exclude   - Regex to exclude files.
    * @property {number}  settings.amount    - Amount of files to be shown.
    * @property {number}  settings.threads   - Maximum amount of threads running concurrently.
    * @property {string}  settings.logLevel  - Log level ('info' or 'verbose').
    * @property {string}  settings.since     - Limit the commits to those made after the specified date.
    * @property {string}  settings.until     - Limit the commits to those made before the specified date.
    * @property {string}  settings.authore   - Only show commits in which the author entry matches the specified string.
    */
    constructor(settings) {
        settings = settings || {}

        settings.repo = typeof settings.repo === 'string' && settings.repo !== ''?
            settings.repo : '.'
        settings.include = typeof settings.include === 'string' && settings.include !== ''?
            settings.include : undefined
        settings.exclude = typeof settings.exclude === 'string' && settings.exclude !== ''?
            settings.exclude : undefined
        settings.amount = typeof settings.amount === 'number'?
            settings.amount : 10
        settings.threads = typeof settings.threads === 'number'?
            settings.threads : 250
        settings.logLevel = typeof settings.logLevel === 'string' && settings.string !== ''?
            settings.logLevel : 'info'
        settings.since = typeof settings.since === 'string' && settings.since !== ''?
            settings.since : undefined
        settings.until = typeof settings.until === 'string' && settings.until !== ''?
            settings.until : undefined
        settings.author = typeof settings.author === 'string' && settings.author !== ''?
            settings.author : undefined
        settings.displayProgress = typeof settings.displayProgress === 'boolean'?
            settings.displayProgress : false
        
        this.settings = settings
        
        logger.setLevel(this.settings.logLevel)
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
    
    setLogLevel(logLevel) {
        this.settings.logLevel = logLevel
        logger.setLevel(logLevel)        
        
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