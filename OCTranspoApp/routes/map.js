/*
 * Main application module
 *
 */

(function () {
    "use strict";

    var request = require('request')
        , xml2js = require('xml2js')
        , ocTranspoKey = '3dbaa821f9f7dbc2cd5ec52f8ceaff63'
        , ocTranspoID = '59bd2043';

    // main handler for get requests to /
    exports.home = function(req, res) {
        var ua = req.header('user-agent');
        if(/mobile/i.test(ua)) {
            res.render('home-mobile', {
                title: 'OCTranspo App',
                layout: 'layout-mobile'
            });
        } else {            
            res.render('home', {
                title: 'OCTranspo App'
            });
        }
    };

    // handler for getting trips
    exports.getSummary = function(req, res) {
        console.log('Incoming request for stop - ' + req.body.stopID);

        // Generate POST request body
        var body = 'appID=' + ocTranspoID + '&apiKey=' + ocTranspoKey;
        body += '&stopNo=' + req.body.stopID;

        // Query OCTranspo servers for stop summary
        request({
            uri: 'https://api.octranspo1.com/v1.1/GetRouteSummaryForStop',
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, function (error, response, body) {
            var js = xml2js.parseString(body, function (err, result) {
                try {
                    result = result['soap:Envelope']['soap:Body'][0]['GetRouteSummaryForStopResponse'][0]['GetRouteSummaryForStopResult'][0];
                    res.send(JSON.stringify(result));
                } catch (e) {
                    res.send(JSON.stringify({error: 'invalid response'}));
                }
            })
        });
    };

    // handler for getting trips
    exports.getTrips = function(req, res) {
        console.log('Incoming request for stop - ' + req.body.stopID);

        // Generate POST request body
        var body = 'appID=' + ocTranspoID + '&apiKey=' + ocTranspoKey;
        body += '&stopNo=' + req.body.stopID;
        body += '&routeNo=' + req.body.routeNo;

        // Query OCTranspo servers for stop summary
        request({
            uri: 'https://api.octranspo1.com/v1.1/GetNextTripsForStop',
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, function (error, response, body) {
            xml2js.parseString(body, function (err, result) {
                result = result['soap:Envelope']['soap:Body'][0]['GetNextTripsForStopResponse'][0]['GetNextTripsForStopResult'][0]['Route'][0]['RouteDirection'][0];
                res.send(JSON.stringify(result));
            })
        });
    };
}());
