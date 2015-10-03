var fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    util = require('util');

var readLine = module.exports = function(file, opts) {
  if (!(this instanceof readLine)) return new readLine(file);

  EventEmitter.call(this);
  opts = opts || {};
  opts.maxLineLength = opts.maxLineLength || 4096; // 4K
  var self = this,
      lineBuffer = new Buffer(opts.maxLineLength),
      lineLength = 0,
      lineCount = 0,
      byteCount = 0,
      emit = function(lineCount, byteCount) {
        try {
          self.emit('line', lineBuffer.slice(0, lineLength).toString(), lineCount, byteCount);
        } catch (err) {
          self.emit('error', err);
        } finally {
          lineLength = 0; // Empty buffer.
        }
      };
    this.input = ('string' === typeof file) ? fs.createReadStream(file, opts) : file;
    this.input.on('open', function(fd) {
        self.emit('open', fd);
    })
  .on('data', function(data) {
     for (var i = 0; i < data.length; i++) {
        if (data[i] == 10 || data[i] == 13) { // Newline char was found.
          lineCount++;
          if (lineLength) emit(lineCount, byteCount);
        } else {
          lineBuffer[lineLength] = data[i]; // Buffer new line data.
          lineLength++;
        }
        byteCount++;
     }
  })
  .on('error', function(err) {
    self.emit('error', err);
  })
  .on('end', function() {
    // Emit last line if anything left over since EOF won't trigger it.
    if (lineLength) {
      lineCount++;
      emit(lineCount, byteCount);
    }
    self.emit('end');
  })
  .on('close', function() {
    self.emit('close');
  });
};
util.inherits(readLine, EventEmitter);
