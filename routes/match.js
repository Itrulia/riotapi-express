var express = require('express');
var q = require('q');
var router = express.Router();

router.get('/:id', function (req, res, next) {
    var promises = [];
    var gnar = require('../gnarFactory')(req.query.region || 'euw');

    req.params.id.split(',').forEach(function (id) {
        promises.push(gnar.match(id).then(function(response) {
            var match = response.body;

            match.participantIdentities.forEach(function(identity, index) {
                match.participants[index].player = identity.player;
            });

            delete match.participantIdentities;

            return match;
        }).catch(function(err) {
            console.log(err);
        }));
    });

    q.all(promises).then(function (matches) {
        if (matches.length === 1) {
            matches = matches.pop();
        }

        res.send(matches);
    });
});

module.exports = router;