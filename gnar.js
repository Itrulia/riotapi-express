module.exports = function gnar(key, region) {
    var request = require('request-promise');

    var platforms = {
        'br': 'BR1',
        'eune': 'EUN1',
        'euw': 'EUW1',
        'jp': 'JP1',
        'kr': 'KR',
        'lan': 'LA1',
        'las': 'LA2',
        'na': 'NA1',
        'oce': 'OC1',
        'ru': 'RU',
        'tr': 'TR1'
    };

    var api = {
        champion: 'api/lol/' + region + '/v1.2/champion/',
        game: 'api/lol/' + region + '/v1.3/game/',
        league: 'api/lol/' + region + '/v2.5/league/',
        lol_static_data: 'api/lol/static-data/' + region + '/v1.2/',
        match: 'api/lol/' + region + '/v2.2/match/',
        matchlist: 'api/lol/' + region + '/v2.2/matchlist/by-summoner/',
        stats: 'api/lol/' + region + '/v1.3/stats/',
        summoner: 'api/lol/' + region + '/v1.4/summoner/',
        mastery: 'championmastery/location/' + platforms[region.toLowerCase()] + '/player/',
        team: 'api/lol/' + region + '/v2.4/team/'
    };

    function url(endpoint, reg, params) {
        var httpParams = [];

        if (!reg) {
            reg = region;
        }

        if (typeof params !== 'object') {
            params = {};
        }

        params["api_key"] = key;
        Object.keys(params).forEach(function (key) {
            httpParams.push(key + '=' + params[key]);
        });

        return 'https://' + reg + '.api.pvp.net/' + endpoint + '?' + httpParams.join('&');
    }

    function get(endpoint, reg, params) {
        console.log(url(endpoint, reg, params));

        return request({
            uri: url(endpoint, reg, params),
            json: true,
            resolveWithFullResponse: true
        });
    }

    function str(ids) {
        return (typeof ids !== 'string') ? ids.join(',') : ids;
    }

    var exports = {};

    exports.champion = {
        all: function () {
            return get(api.champion);
        },
        by_id: function (id) {
            return get(api.champion + id);
        }
    };

    exports.league = {
        by_summoner: function (ids) {
            return get(api.league + 'by-summoner/' + str(ids));
        },
        entries: {
            by_summoner: function (ids) {
                return get(api.league + 'by-summoner/' + str(ids) + '/entry');
            }
        }
    };

    exports.lol_static_data = {
        champion: {
            all: function (params) {
                return get(api.lol_static_data + 'champion', 'global', params);
            },
            by_id: function (id, params) {
                return get(api.lol_static_data + 'champion/' + id, 'global', params);
            }
        },
        item: {
            all: function (params) {
                return get(api.lol_static_data + 'item', 'global', params);
            },
            by_id: function (id, params) {
                return get(api.lol_static_data + 'item/' + id, 'global', params);
            }
        },
        mastery: {
            all: function (params) {
                return get(api.lol_static_data + 'mastery', 'global', params);
            },
            by_id: function (id, params) {
                return get(api.lol_static_data + 'mastery/' + id, 'global', params);
            }
        },
        realm: function () {
            return get(api.lol_static_data + 'realm', 'global');
        },
        rune: {
            all: function (params) {
                return get(api.lol_static_data + 'rune', 'global', params);
            },
            by_id: function (id, params) {
                return get(api.lol_static_data + 'rune/' + id, 'global', params);
            }
        },
        summoner_spell: {
            all: function (params) {
                return get(api.lol_static_data + 'summoner-spell', 'global', params);
            },
            by_id: function (id, params) {
                return get(api.lol_static_data + 'summoner-spell/' + id, 'global', params);
            }
        },
        versions: function () {
            return get(api.lol_static_data + 'versions', 'global');
        }
    };

    exports.match = function (id) {
        return get(api.match + id, null, {includeTimeline: 'true'});
    };

    exports.matchlist = function (id) {
        return get(api.matchlist + id, null, {seasons: 'SEASON2016'});
    };

    exports.stats = {
        ranked: function (id) {
            return get(api.stats + 'by-summoner/' + id + '/ranked');
        }
    };

    exports.summoner = {
        by_name: function (names) {
            return get(api.summoner + 'by-name/' + str(names));
        },
        by_id: function (ids) {
            return get(api.summoner + str(ids));
        },
        masteries: function (ids) {
            return get(api.summoner + str(ids) + '/masteries');
        },
        runes: function (ids) {
            return get(api.summoner + str(ids) + '/runes');
        }
    };

    exports.mastery = {
        champions: function (id) {
          return get(api.mastery + id + '/champions')
        }
    };

    return exports;
};