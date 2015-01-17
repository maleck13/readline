var test = require("tap").test;
var readLine = require('../readline.js');
test("test reading lines",function(t){
   console.error("reading large file line by line asserts may take a while");
   var rl = readLine('./fixtures/afile.txt');
   rl.on("line", function (line,linecount){
     t.ok(null !== line && undefined !== line);
   });
   rl.on("end",function (){
   	t.end();
   });
   
});

test("numbers", function (t){
   var rl = readLine('./fixtures/nmbr.txt');
   var answer = 28;
   var i=0;
   rl.on("line", function (line){
   	 	var num = Number(line);
   	 	console.error(num);
        i+=num;

   });
   rl.on("end", function (){
   	console.error(i,answer);
   t.ok(answer === i, "answered");
   t.end();
   });
});


test("errors", function (t){
	var rl = readLine("./Idontexist");
    rl.on('error', function (e){
      t.ok(e);
      t.end();
    });
    rl.on('end', function (){
    	t.end();
    });
    rl.on('close', function(){
     t.end();
    });
});


test("line count", function(t){
  var rl = readLine('./fixtures/nmbr.txt');
  var expect = 7;
  var actual = 0;
  rl.on("line", function (line, ln){
    console.log("line",line,ln);
    actual=ln;
  });
  rl.on("end", function (){
    t.ok(actual === expect,"line count is correct");
    t.end();
  });
});


