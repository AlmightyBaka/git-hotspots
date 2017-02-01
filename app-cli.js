#!/usr/bin/env node

const program = require("commander"),
      gitWrapper = require("./gitWrapper.js");

program
    .version("0.0.1")
    .command('list [directory]')
    .description('list top 10 most-changed files')
    .option("-a, --amount [n]", "list top n most-changed files", 10)
    .option('-v, --verbose', "verbose output")
    .action(function (dir, options) {
        if (!dir) {
            dir = process.cwd();
        }
        if (!options.verbose) {
            gitWrapper.getAll(dir, options.amount);
        }
        else {
            gitWrapper.getAll(dir, options.amount, options.verbose);            
        }

        console.log(dir, options.amount, options.verbose);
    });

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}