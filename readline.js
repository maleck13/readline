var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var newlines = [
  13, // \r
  10  // \n
];

function readLine (file, opts){

   if (!(this instanceof readLine)) return new readLine(file);
  
   EventEmitter.call(this);
   opts = opts || {};
   var self = this;
   var readStream = fs.createReadStream(file);
   var nl = require('os').EOL.charCodeAt(0); //could prob change this to just be the number 10
   var line = [];   

   readStream.on("open",function (fd){
      self.emit('open',fd);  
   });
   
   readStream.on("data", function (data){     
     for(var i=0; i < data.length; i++){
        if(newlines.indexOf(data[i]) != -1){
          if (line.length) {
            var tmpBuf = new Buffer(line);
            self.emit("line",tmpBuf.toString());
          }
          line = [];
        }else{
          line.push(data[i]); 
        }
     }
   });
   readStream.on("error", function (err){
      self.emit("error",err);

   });

   readStream.on("end", function (){
    // emit last line if anything left over since EOF doesn't trigger it
    if (line.length) { 
      var tmpBuf = new Buffer(line);
      self.emit("line",tmpBuf.toString());
    }

    self.emit("end");
   });
   
   readStream.on("close", function (){
    self.emit("close");
   });
};

util.inherits(readLine, EventEmitter);
module.exports = readLine;
