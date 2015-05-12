#!/usr/bin/env node

var gaze = require('gaze');
var child_process = require('child_process');

function runTests () {
  child_process.spawn('npm', ['test'], {
    cwd: root,
    stdio: 'inherit'
  });
}

var paths = ['test/**/*.js', 'lib/**/*.js', 'bin/**/*.js'];
gaze(paths, { cwd: __dirname }, function () {
  this.on('all', runTests);
});

// run it now!
runTests();
