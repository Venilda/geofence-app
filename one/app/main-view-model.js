var Observable = require("data/observable").Observable;
var application = require("application");
var utils = require("utils/utils");
var services = require("./service-helper");
var permissions = require('nativescript-permissions');


function getMessage(counter) {
    return counter;
}

function createViewModel() {
    var viewModel = new Observable();
    viewModel.message = "Try implementing a stop-notifications (alarm) functionality!";

    permissions.requestPermission(android.Manifest.permission.ACCESS_FINE_LOCATION, "I need these permissions to access to location")
        .then(function() {
            console.log("Yes, accessed!");
        })
        .catch(function() {
            console.log("Uh oh, :(");
        });

    viewModel.onTap = function() {
        services.setupAlarm(utils.ad.getApplicationContext());
    }

    return viewModel;
}

exports.createViewModel = createViewModel;