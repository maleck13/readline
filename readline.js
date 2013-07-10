var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
function readLine (file, opts){

   if (!(this instanceof readLine)) return new readLine(file);;
  
   EventEmitter.call(this);
   
   var self = this;
   var readStream = fs.createReadStream(file);
   var nl = "\n".charCodeAt(0);
   var line = [];   

   readStream.on("open",function (){
        
   });
   
   readStream.on("data", function (data){
     console.error("data emmitted");
     for(var i=0; i < data.length; i++){
        if(data[i] === nl){
          var tmpBuf = new Buffer(line);
          self.emit("line",tmpBuf.toString());
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

     console.error("end of stream");
   });
   
};

util.inherits(readLine, EventEmitter);
module.exports = readLine;
