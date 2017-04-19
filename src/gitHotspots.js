const gitCounter = require("./util/gitCounter.js"),
logger = require('./util/logger.js');

class GitHotspots{
    constructor(settings) {
        settings = settings || {};
        this.repo = typeof settings.repo === "string"? settings.repo : undefined;
        this.amount = typeof settings.amount === "number"? settings.amount : 10;
        this.logLevel = typeof settings.logLevel === "string"? settings.logLevel : 'info';
        
        logger.setLevel(this.logLevel);
    }
    
    setRepo(dir) {
        this.repo = dir;
        return this;
    }
    
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    
    setLogLevel(logLevel) {
        this.logLevel = logLevel;
        logger.setLevel(this.logLevel);        
        
        return this;
    }
    
    getHotspots(callback) {
        gitCounter(this.repo, callback, this.amount);
    }
}

module.exports = GitHotspots;