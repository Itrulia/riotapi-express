var TWELVE_SECONDS = 12000;
var requestCount = 0;
var timeoutCount = 0;
var requestTimestamps = [];

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

    exports.limit = function () {
        var currentTime = new Date().getTime();
        var latestTimeout = requestTimestamps[timeoutCount];
        var timeoutDuration = 0;

        if (
            currentTime > (latestTimeout + TWELVE_SECONDS) &&
            requestCount >= requestLimit &&
            timeoutCount < requestLimit
        ) {
            requestCount--;
            requestTimestamps.splice(timeoutCount, (timeoutCount + 1));
        }

        if (requestCount >= requestLimit && timeoutCount >= requestLimit) {
            timeoutDuration = (requestTimestamps[(requestLimit - 1)] + TWELVE_SECONDS) - currentTime;

            return timeoutPromise(timeoutDuration).then(function () {
                return exports.limit();
            });
        }

        if (requestCount >= requestLimit) {
            timeoutDuration = latestTimeout - currentTime + TWELVE_SECONDS;
            timeoutCount++;

            return timeoutPromise(timeoutDuration).then(function () {
                requestTimestamps.splice(0, 1);
                timeoutCount--;
                requestCount--;

                return exports.limit();
            });
        }

        requestCount++;
        requestTimestamps.push(currentTime);

        return q.when('');
    };

    exports.setRateLimit = function (rateLimit) {
        requestLimit = rateLimit;
    };

    return exports;
};