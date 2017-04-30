git-hotspots
---
A console tool to show the most changed files in a git repository.

### Why?
Seeing the most-commited-to files can help you decide which files could use the most refactoring and restructuring into separate modules, instead of wasting your time on parts that no one will ever touch.

Right now it's file-level, but class/method-level and line-level is planned.

Can be slow for big repositories, not really sure how to fix it yet (git pls)

### Usage
git-hotspots is based on Node, so you can install it via npm:
```
npm install -g git-hotspots
```
To list the most "hot" files:
```
git-hotspots list [directory, empty for current]
```
To specify the amount of listed files:
```
git-hotspots list --amount 15
```
To limit log output use --since, --until, and --author flags (usage is the same as when using git log with corresponding flags, see [here](https://git-scm.com/book/tr/v2/Git-Basics-Viewing-the-Commit-History#_limiting_log_output) for available formats)
```
git-hotspots list --since "1 week" --until "yesterday" --author "John"
```
To include or exclude files by globbing:
```
git-hotspots list --include "**/*.html" --exclude "{index*,layout*}"
```

### Changelog
```
0.4.0 - added directory globbing with --include and --exclude flags
```
```
0.3.0 - added --verbose, --threads, --since, --until, --author flags
```
```
0.2.0 - switched to system-installed git, results are now the same as when running git's log command itself
```
```
0.1.0 - intial release
```