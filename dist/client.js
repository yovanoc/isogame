'use strict';

var primus = new Primus('http://localhost:2121/');

primus.on('data', function (data) {
  console.log(data);
  primus.write("Thanks");
});