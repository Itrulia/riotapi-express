var gnar = require('./gnar');
var env = require('./.env.json');

module.exports = function(region) {
    if (!region) {
        region = 'EUW';
    }

    return gnar(env.api_key, region.toLowerCase(), env.rate);
};