"use strict";
require('dotenv').config();
var app = require('./app');
var port = process.env.PORT;
app.listen(port, function () {
    console.log("Sever is running at " + port);
});
