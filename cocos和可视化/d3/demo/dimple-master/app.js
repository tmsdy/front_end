var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

app.use('/',(req,res,next) => {
    console.log(req.query)
    next()
})

app.listen(process.env.PORT || 3000);