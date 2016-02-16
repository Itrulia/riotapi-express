var gnar = require('./gnar');

module.exports = function(region) {
    if (!region) {
        region = 'EUW';
    }

    return gnar('625d373a-a598-41f8-b088-c61cfb804a37', region.toLowerCase());
};