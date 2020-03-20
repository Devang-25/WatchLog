const assert = require('assert');
const watchmyfile = require('../utils.js');
const mock = require('mock-fs');

describe('WatchMyFile', function() {
  describe('lastLines', function() {
    it('[lastLines] Should be ENOENT error as the targeted logfile doesn\'t exists', function () {
      mock({})
      watchmyfile.lastLines("logfile").catch(err => {
        assert.equal(err.code,"ENOENT");
      })
      mock.restore()
    });
    it('[lastLines] Should be [] as the file is empty', function () {
      mock({
        'logfile.log': mock.file()
      })
      watchmyfile.lastLines("logfile.log").then(lines => {
        assert.equal(lines, []);
      })
      mock.restore()
    });
    it('[lastLines] Should be the last lines as there is less than 10 lines', function () {
      fileContent = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];
      mock({
        'logfile.log': mock.file(fileContent.join("\n"))
      })
      watchmyfile.lastLines("logfile.log").then(lines => {
        assert.equal(lines, fileContent);
      })
      mock.restore()
    });
    it('[lastLines] Should be the last 10 lines as there is more than 10 lines', function () {
      fileContent = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];
      mock({
        'logfile.log': mock.file(fileContent.join("\n"))
      })
      watchmyfile.lastLines("logfile.log").then(lines => {
        assert.equal(lines, fileContent.slice[-10]);
      })
      mock.restore()
    });
  });
  describe('newLines', function() {
    it('[newLines] Should be ENOENT error as the targeted logfile doesn\'t exists', function () {
      mock({})
      watchmyfile.newLines("logfile","").catch(err => {
        assert.equal(err.code,"ENOENT");
      })
      mock.restore()
    });
    it('[newLines] Should be [] as the file is empty', function () {
      mock({
        'logfile.log': mock.file()
      })
      watchmyfile.newLines("logfile.log").then(lines => {
        assert.equal(lines, []);
      })
      mock.restore()
    });
    it('[newLines] Should be the entire file as the file was empty', function () {
      fileContent = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];
      mock({
        'logfile.log': mock.file(fileContent.join("\n"))
      })
      watchmyfile.lastLines("logfile.log").then(lines => {
        assert.equal(lines, fileContent);
      })
      mock.restore()
    });
    it('[newLines] Should be the last line as the last line read was Amet', function () {
      fileContent = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Newline'];
      mock({
        'logfile.log': mock.file(fileContent.join("\n"))
      })
      watchmyfile.lastLines("logfile.log").then(lines => {
        assert.equal(lines, fileContent.slice(-1));
      })
      mock.restore()
    });
  });
});