var TWELVE_SECONDS = 12000;
var regions = {};

module.exports = function rateLimit(requestLimit) {
    var exports = {};
    var q = require('q');
    requestLimit = requestLimit || 10;

    var timeoutPromise = function (timeout) {
        var deferred = q.defer();

        setTimeout(function() {
            deferred.resolve();
        }, timeout);

        return deferred.promise;
    };

    exports.limit = function (region) {
        region = region.toLowerCase();

        if (!(region in regions)) {
            regions[region] = {
                requestCount: 0,
                timeoutCount: 0,
                requestTimestamps: []
            };
        }

        var currentTime = new Date().getTime();
        var latestTimeout = regions[region].requestTimestamps[regions[region].timeoutCount];
        var timeoutDuration = 0;

        if (
            currentTime > (latestTimeout + TWELVE_SECONDS) &&
            regions[region].requestCount >= requestLimit &&
            regions[region].timeoutCount < requestLimit
        ) {
            regions[region].requestCount--;
            regions[region].requestTimestamps.splice(regions[region].timeoutCount, (regions[region].timeoutCount + 1));
        }

        if (regions[region].requestCount >= requestLimit && regions[region].timeoutCount >= requestLimit) {
            timeoutDuration = (regions[region].requestTimestamps[(requestLimit - 1)] + TWELVE_SECONDS) - currentTime;

            return timeoutPromise(timeoutDuration).then(function () {
                return exports.limit();
            });
        }

        if (regions[region].requestCount >= requestLimit) {
            timeoutDuration = latestTimeout - currentTime + TWELVE_SECONDS;
            regions[region].timeoutCount++;

            return timeoutPromise(timeoutDuration).then(function () {
                regions[region].requestTimestamps.splice(0, 1);
                regions[region].timeoutCount--;
                regions[region].requestCount--;

                return exports.limit();
            });
        }

        regions[region].requestCount++;
        regions[region].requestTimestamps.push(currentTime);

        return q.when('');
    };

    exports.setRateLimit = function (rateLimit) {
        requestLimit = rateLimit;
    };

    return exports;
};