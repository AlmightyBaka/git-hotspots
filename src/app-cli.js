#!/usr/bin/env node

const program = require("commander"),
gitWrapper = require("./gitWrapper.js");

// TODO: branch selection

program
.version("0.2.0")
.command('list [directory]')
.description("list top 10 most-changed files")
.option('-a, --amount [n]', "list top n most-changed files (10 by default)", 10)
.option('-t, --threads [n]', "maximum amount of threads running concurrently (250 by default)", 250)
.option('-v, --verbose', "verbose output")
.action(function (dir, options) {
    dir = dir ? dir : process.cwd();
    
    gitWrapper.listPrint(dir, options.amount, options.verbose? 'verbose' : 'info', options.threads);
});

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}