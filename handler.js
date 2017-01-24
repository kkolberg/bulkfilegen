'use strict';
var randomstring = require("randomstring");
var json2csv = require('json2csv');
var fs = require('fs');

var finish = false;

function cat(event, context, callback) {


  var gen = function (n) {
    return {
      "column1": n,
      "column2": randomstring.generate() + "\n" + randomstring.generate(),
      "column3": Math.random(),
      "column4": randomstring.generate() + "," + randomstring.generate(),
      "nested": JSON.stringify({
        "nest1": Math.random(),
        "nest1": randomstring.generate() + '"catmando"' + randomstring.generate(),
        "nest2": Math.random(),
        "nest3": randomstring.generate() + "\n" + randomstring.generate(),
      }),
      "column5": "end of " + n
    };
  }

  var fields = ['column1', 'column2', 'column3', "nested", 'column5'];

  var x = 0;

  var cat = function (cb) {
    var i = 0;
    var myData = [];
    for (i = 0; i < 1000; i++) {
      myData.push(gen(x + "-" + i));
    }
    var csv = json2csv({ data: myData, fields: fields, hasCSVColumnTitle: x === 0 && i === 0 });
    fs.appendFile('./file.csv', csv, function (err) {
      if (err) throw err;
      console.log('saved x=' + x);
      x++;

      if (x < 20000) {
        cat(cb);
      } else {
        cb(null, {});
      }
    });
  }

  cat(callback);
};

cat(null, null, function () {
  finish = true;
  console.log("done");
});

function wait() {
  if (!finish) {
    setTimeout(wait, 1000);
  }
};
wait();
