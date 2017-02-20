git-hotspots
---
A console tool to show the most changed files in a git repository. 

###Why?
Seeing the most-commited-to files can help you decide which files could use the most refactoring and restructuring into separate modules, instead of wasting your time on parts that no one will ever touch. Right now it's file-level, but class/method-level and line-level is planned.

###Usage
git-hotspots is based on Node, so you can install it via npm:
```
npm install git-hotspots
```
To list the most "hot" files:
```
git-hotspots list [directory, empty for current]
```
To specify the amount of listed files:
```
git-hotspots list -a [number, default is 10]
```