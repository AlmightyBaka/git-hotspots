const winston = require('winston')

let logger = {
    get: () => winston,
    setLevel: level => winston.level = level

}

module.exports = logger