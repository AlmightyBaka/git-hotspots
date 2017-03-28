const gitCounter = require("./gitCounter.js");

class GitHotspots{
    constructor(settings) {
        settings = settings || {};
        this.repo = typeof settings.repo === "string"? settings.repo : undefined;
        this.amount = typeof settings.amount === "number"? settings.amount : 10;
        this.verbose = typeof settings.verbose === "boolean"? settings.verbose : false;
    }
    
    setRepo(dir) {
        this.repo = dir;
        return this;
    }
    
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    
    setVerbose(isVerbose) {
        this.verbose = isVerbose;
        return this;
    }
    
    getHotspots(callback) {
        gitCounter.getHotspots(this.repo, callback, this.amount, this.verbose);
    }
}

module.exports = GitHotspots;