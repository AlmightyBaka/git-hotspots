#!/usr/bin/env node

const fs = require('fs'),
path = require('path')

const program = require('commander')

const gitWrapper = require('./gitWrapper.js')

program
.version(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version)
.command('list [repository]')
.description('list top 10 most-changed files')
.option('-a, --amount [number]',  'list top n most-changed files (10 by default)', 10)
.option('-i, --include [string]', 'include files by regex')
.option('-e, --exclude [string]', 'exclude files by regex')
.option('-s, --since [string]',   'limit the commits to those made after the specified date (using the same format as git log --since)')
.option('-u, --until [string]',   'limit the commits to those made before the specified date (using the same format as git log --until)')
.option('-a, --author [string]',  'only show commits in which the author entry matches the specified string')
.option('-t, --threads [number]', 'maximum amount of threads running concurrently (250 by default)', 250)
.option('-v, --verbose',          'verbose output')
.action(function (repo, options) {
    repo = path.resolve(repo ? repo : process.cwd())
    
    gitWrapper.listPrint({
        repo: repo,
        include: options.include,
        exclude: options.exclude,
        amount: Number(options.amount),
        verbose: options.verbose,
        threads: Number(options.threads),
        since: options.since,
        until: options.until,
        author: options.author,
        displayProgress: options.verbose? false : true
    })
})

program.parse(process.argv)

if (!program.args.length) {
    program.help()
}