var express = require('express');
var q = require('q');
var router = express.Router();

router.get('/champion', function (req, res, next) {
    var gnar = require('../gnarFactory')(req.query.region || 'euw');
    gnar.lol_static_data.champion.all({champData: 'image,spells'}).then(function (response) {
        var champions = {};

        Object.keys(response.body.data).forEach(function(key) {
            var spells = [];

            response.body.data[key].spells.forEach(function(spell) {
               spells.push({
                   name: spell.name,
                   description: spell.sanitizedDescription,
                   key: spell.key,
                   image: spell.image
               });
            });

            response.body.data[key].spells = spells;
            champions[response.body.data[key].id] = response.body.data[key];
        });

        res.send(champions);
    });
});

router.get('/item', function (req, res, next) {
    var gnar = require('../gnarFactory')(req.query.region || 'euw');
    gnar.lol_static_data.item.all({itemListData: 'image'}).then(function (response) {
        var items = {};

        Object.keys(response.body.data).forEach(function(key) {
            items[response.body.data[key].id] = response.body.data[key];
        });

        res.send(items);
    });
});

router.get('/rune', function (req, res, next) {
    var gnar = require('../gnarFactory')(req.query.region || 'euw');
    gnar.lol_static_data.rune.all({runeListData: 'image'}).then(function (response) {
        var runes = {};

        Object.keys(response.body.data).forEach(function(key) {
            runes[response.body.data[key].id] = response.body.data[key];
        });

        res.send(runes);
    });
});

router.get('/summoner-spell', function (req, res, next) {
    var gnar = require('../gnarFactory')(req.query.region || 'euw');
    gnar.lol_static_data.summoner_spell.all({spellData: 'image'}).then(function (response) {
        var summonerSpells = {};

        Object.keys(response.body.data).forEach(function(key) {
            summonerSpells[response.body.data[key].id] = response.body.data[key];
        });

        res.send(summonerSpells);
    });
});

router.get('/mastery', function (req, res, next) {
    var gnar = require('../gnarFactory')(req.query.region || 'euw');
    gnar.lol_static_data.mastery.all({masteryListData: 'image,tree'}).then(function (response) {
        var masteries = {
            data: response.body.data,
            tree:  response.body.tree
        };

        res.send(masteries);
    });
});

router.get('/version', function (req, res, next) {
    var gnar = require('../gnarFactory')(req.query.region || 'euw');
    gnar.lol_static_data.versions().then(function (response) {
        res.send(response.body);
    });
});

router.get('/realm', function (req, res, next) {
    var gnar = require('../gnarFactory')(req.query.region || 'euw');
    gnar.lol_static_data.realm().then(function (response) {
        res.send(response.body);
    });
});

module.exports = router;