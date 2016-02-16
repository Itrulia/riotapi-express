module.exports = function gnar(api_key, requested_region) {
    var request = require('request-promise');
    var key = api_key;
    var region = requested_region;

    var api = {
        champion: region + '/v1.2/champion/',
        game: region + '/v1.3/game/',
        league: region + '/v2.5/league/',
        lol_static_data: 'static-data/' + region + '/v1.2/',
        match: region + '/v2.2/match/',
        matchlist: region + '/v2.2/matchlist/by-summoner/',
        stats: region + '/v1.3/stats/',
        summoner: region + '/v1.4/summoner/',
        team: region + '/v2.4/team/'
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

        return 'https://' + reg + '.api.pvp.net/api/lol/' + endpoint + '?' + httpParams.join('&');
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
        by_team: function (ids) {
            return get(api.league + 'by-team/' + str(ids));
        },
        challenger: function () {
            return get(api.league + 'challenger');
        },
        entries: {
            by_summoner: function (ids) {
                return get(api.league + 'by-summoner/' + str(ids) + '/entry');
            },
            by_team: function (ids) {
                return get(api.league + 'by-team/' + str(ids) + '/entry');
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
        },
        summary: function (id) {
            return get(api.stats + 'by-summoner/' + id + '/summary');
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

    return exports;
};