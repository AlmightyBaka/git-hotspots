const winston = require('winston'),
ProgressBar = require('progress')

let logger = {
    get: () => winston,
    setLevel: level => winston.level = level,
    setBar: length => this.bar = new ProgressBar(
    'processing: [:bar] :percent ETA: :etas',
    {
        total: length,
        width: 20
    }),
    tickBar: () => 
    {
        if (this.bar !== undefined) {
            this.bar.tick()
        }
    }
}

module.exports = logger