var test = require("tap").test;
var readLine = require('../readline.js');
test("test reading lines",function(t){
   var rl = readLine('./fixtures/afile.txt');
   rl.on("line", function (line){
     console.error(line); 
   });
   t.end();
});


