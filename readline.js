var fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    util = require('util');

var readLine = module.exports = function(file, opts) {
  if (!(this instanceof readLine)) return new readLine(file, opts);

  EventEmitter.call(this);
  opts = opts || {};
  opts.maxLineLength = opts.maxLineLength || 4096; // 4K
  opts.retainBuffer = !!opts.retainBuffer; //do not convert to String prior to invoking emit 'line' event
  var self = this,
      lineBuffer = new Buffer(opts.maxLineLength),
      lineLength = 0,
      lineCount = 0,
      byteCount = 0,
      emit = function spliceAndEmit(lineCount, byteCount) {
        try {
          var line = lineBuffer.slice(0, lineLength);
          self.emit('line', opts.retainBuffer? line : line.toString(), lineCount, byteCount);
        } catch (err) {
          self.emit('error', err);
        } finally {
          lineLength = 0; // Empty buffer.
        }
      };
  this.input = ('string' === typeof file) ? fs.createReadStream(file, opts) : file;
  this.input
    .on('open', function onOpen(fd) {
      self.emit('open', fd);
    })
    .on('data', function onData(data) {
      var dataLen = data.length;
      for (var i = 0; i < dataLen; i++) {
        if (data[i] === 10) { // Newline char was found.
          lineCount++;
          emit(lineCount, byteCount);
        } else if (data[i] === 13) {
          // ignore
        } else {
          lineBuffer[lineLength] = data[i]; // Buffer new line data.
          lineLength++;
        }
        byteCount++;
      }
    })
    .on('error', function onError(err) {
      self.emit('error', err);
    })
    .on('end', function onEnd() {
      // Emit last line if anything left over since EOF won't trigger it.
      if (lineLength) {
        lineCount++;
        emit(lineCount, byteCount);
      }
      self.emit('end');
    })
    .on('close', function onClose() {
      self.emit('close');
    });
};
util.inherits(readLine, EventEmitter);
