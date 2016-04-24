var express = require('express');
var app = express();

var summoner = require('./routes/summoner');
var match = require('./routes/match');
var data = require('./routes/static');

app.use('/summoner', summoner);
app.use('/match', match);
app.use('/static', data);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    res.status(err.statusCode);
    res.send({
        message: err.error.status.message,
        error: err.statusCode
    });
});

app.listen(4000, function () {

});