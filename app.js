'use strict'

require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser')
var jade = require('jade');
var twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
var app = express();

var port = process.env.PORT || 3000

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
  var html = jade.renderFile('views/index.jade', {});
  res.send(html);
});

app.get('/address', function (req, res) {
  var html = jade.renderFile('views/address.jade', {});
  res.send(html);
});

app.post('/thank-you', function (req, res) {
  var order = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    unit: req.body.unit,
    postalCode: req.body['postal-code'],
    city: req.body.city
  };

  notifyOrder(order);

  var html = jade.renderFile('views/thank-you.jade', {});
  res.send(html);
});

function notifyOrder(order) {
  var message = `Order Received!\n${order.name}\n${order.address}, Apt ${order.unit || "N/A"}\n${order.postalCode}\n${order.phone}`;

  twilio.sendMessage({
    to: process.env.DEST_PHONE,
    from: process.env.TWILIO_PHONE,
    body: message
  }, function(err, responseData) {
    if (err) {
      console.log("Error!", err);
    } else {
      console.log(responseData.body);
    }
  });
}

app.listen(port, function () {
  console.log('The server is listening on port', port);
});

