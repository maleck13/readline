var fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    newlines = [
      13, // \r
      10  // \n
    ];

var readLine = module.exports = function(file, opts) {
  if (!(this instanceof readLine)) return new readLine(file);

  EventEmitter.call(this);
  opts = opts || {};
  var self = this,
      line = [],
      lineCount = 0,
      byteCount = 0,
      emit = function(line, lineCount, byteCount) {
        self.emit('line', new Buffer(line).toString(), lineCount, byteCount);
      };
    this.input = fs.createReadStream(file, opts);
    this.input.on('open', function(fd) {
        self.emit('open', fd);
    })
  .on('data', function(data) {
     for (var i = 0; i < data.length; i++) {
        byteCount++;
        if (0 <= newlines.indexOf(data[i])) { // Newline char was found.
          lineCount++;
          if (line.length) emit(line, lineCount, byteCount);
          line = []; // Empty buffer.
        } else {
          line.push(data[i]); // Buffer new line data.
        }
     }
  })
  .on('error', function(err) {
    self.emit('error', err);
  })
  .on('end', function() {
    // Emit last line if anything left over since EOF won't trigger it.
    if (line.length){
      lineCount++;
      emit(line, lineCount, byteCount);
    }
    self.emit('end');
  })
  .on('close', function() {
    self.emit('close');
  });
};
util.inherits(readLine, EventEmitter);
