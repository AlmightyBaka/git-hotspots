const gitCounter = require("./util/gitCounter.js"),
logger = require('./util/logger.js');

class GitHotspots{
    constructor(settings) {
        settings = settings || {};
        settings.repo = typeof settings.repo === "string"? settings.repo : undefined;
        settings.amount = typeof settings.amount === "number"? settings.amount : 10;
        settings.logLevel = typeof settings.logLevel === "string"? settings.logLevel : 'info';
        
        this.settings = settings;

        logger.setLevel(this.logLevel);
    }
    
    setRepo(dir) {
        this.settings.repo = dir;
        return this;
    }
    
    setAmount(amount) {
        this.settings.amount = amount;
        return this;
    }
    
    setLogLevel(logLevel) {
        this.settings.logLevel = logLevel;
        logger.setLevel(this.logLevel);        
        
        return this;
    }
    
    getHotspots(callback) {
        gitCounter(this.settings, callback);
        return this;
    }
}

module.exports = GitHotspots;