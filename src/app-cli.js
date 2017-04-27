#!/usr/bin/env node

const fs = require('fs'),
path = require('path')

const program = require('commander')

const gitWrapper = require('./gitWrapper.js')

program
.version(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version)
.command('list [directory]')
.description('list top 10 most-changed files')
.option('-a, --amount [number]',  'list top n most-changed files (10 by default)', 10)
.option('-t, --threads [number]', 'maximum amount of threads running concurrently (250 by default)', 250)
.option('-s, --since [string]',   'limit the commits to those made after the specified date (using the same format as git log --since')
.option('-u, --until [string]',  'limit the commits to those made before the specified date (using the same format as git log --until')
.option('-a, --author [string]',  'only show commits in which the author entry matches the specified string')
.option('-v, --verbose', 'verbose output')
.action(function (dir, options) {
    dir = dir ? dir : process.cwd()
    
    gitWrapper.listPrint({
        repo: dir,
        amount: Number(options.amount),
        logLevel: options.verbose? 'verbose' : 'info',
        threads: Number(options.threads),
        since: options.since,
        until: options.until,
        author: options.author
    })
})

program.parse(process.argv)

if (!program.args.length) {
    program.help()
}