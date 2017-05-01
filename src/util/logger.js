const ProgressBar = require('progress')

this.verbose = false;

let logger = {
    verbose: string => {if (this.verbose) console.log(string)},
    log: string => console.log(string),
    setVerbose: verbose => this.verbose = verbose,
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