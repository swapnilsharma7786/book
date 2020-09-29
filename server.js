const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./routes')(app);

let server = app.listen(process.env.PORT || 3000);
module.exports = server;