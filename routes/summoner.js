var express = require('express');
var router = express.Router();
var gnarFactory = require('../gnarFactory');

router.get('/:id', function (req, res, next) {
    var gnar = gnarFactory(req.query.region || 'euw');
    var request;

    if (parseInt(req.params.id)) {
        request = gnar.summoner.by_id(req.params.id);
    } else {
        request = gnar.summoner.by_name(req.params.id);
    }

    request.then(function (response) {
        var data = response.body;
        var keys = Object.keys(data);

        if (keys.length === 1) {
            res.send(data[keys.pop()]);
        } else {
            res.send(data);
        }
    }).catch(next);
});

router.get('/:id/masteries', function (req, res, next) {
    var gnar = gnarFactory(req.query.region || 'euw');

    gnar.summoner.masteries(req.params.id).then(function (response) {
        res.send(response.body[req.params.id].pages);
    }).catch(next);
});

router.get('/:id/runes', function (req, res, next) {
    var gnar = gnarFactory(req.query.region || 'euw');

    gnar.summoner.runes(req.params.id).then(function (response) {
        res.send(response.body[req.params.id].pages);
    }).catch(next);
});

router.get('/:id/matches', function (req, res, next) {
    var gnar = gnarFactory(req.query.region || 'euw');

    gnar.matchlist(req.params.id).then(function (response) {
        res.send(response.body.matches);
    }).catch(next);
});

router.get('/:id/rank', function (req, res, next) {
    var gnar = gnarFactory(req.query.region || 'euw');

    gnar.league.entries.by_summoner(req.params.id).then(function (response) {
        res.send(response.body);
    }).catch(next);
});


router.get('/:id/championmastery', function (req, res, next) {
    var gnar = gnarFactory(req.query.region || 'euw');

    gnar.mastery.champions(req.params.id).then(function (response) {
        res.send(response.body);
    }).catch(next);
});

router.get('/:id/stats', function (req, res, next) {
    var gnar = gnarFactory(req.query.region || 'euw');

    gnar.stats.ranked(req.params.id).then(function (response) {
        res.send(response.body.champions);
    }).catch(next);
});


module.exports = router;