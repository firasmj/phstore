var express = require('express');
var fs = require('fs');
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function(req, res) {
  const orderData = req.body;
  const stringOrder = JSON.stringify(orderData);
  fs.appendFile('orders.txt', stringOrder , (err) => {
    if (err) throw err;
    console.log('order sent successfully');
  });
});

app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});
