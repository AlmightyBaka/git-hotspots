const winston = require('winston')

let logger = {
    get: () => {
        return winston
    },
    setLevel: (level) => {
        winston.level = level
    }
}

module.exports = logger