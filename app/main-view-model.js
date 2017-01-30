var Observable = require("data/observable").Observable;
var utils = require("utils/utils");
//var androidApi = require("com.android.support");

var GoogleApi = com.google.android.gms.location;
var context = utils.ad.getApplicationContext();


function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
        return counter + " taps left";
    }
}

function createViewModel() {

    /* ------------------------------------------------- */

    var getGeofencingRequest = function() {

        var geofancePoint = new GoogleApi.Geofence.Builder()
            .setRequestId("Obecto")
            .setCircularRegion(
                42.6622177,
                23.3176289,
                10
            ).setExpirationDuration(12 * 60 * 60 * 1000)
            .setTransitionTypes(1 | 2)
            .build();

        //var geofenceList = java.utils.List();

        var builder = new GoogleApi.GeofencingRequest.Builder();
        builder.setInitialTrigger(GoogleApi.GeofencingRequest.INITIAL_TRIGGER_ENTER);
        builder.addGeofence(geofancePoint);
        return builder.build();
    }


    var mGeofencePendingIntent = null;
    var getGeofencePendingIntent = function() {
        // Reuse the PendingIntent if we already have it.
        if (mGeofencePendingIntent != null) {
            return mGeofencePendingIntent;
        }

        var intent = new android.content.Intent(context, com.tns.notifications.NotificationIntentService.class);
        //intent.setAction("GEOFENSE_UPDATE");

        // We use FLAG_UPDATE_CURRENT so that we get the same pending intent back when
        // calling addGeofences() and removeGeofences().
        mGeofencePendingIntent = android.app.PendingIntent.getService(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
        return mGeofencePendingIntent;
    }



    /* ------------------------------------------------- */

    var viewModel = new Observable();

    // Tab the button.
    viewModel.onTap = function() {
        // Define an Intent for geofence transitions

        var connectionListeners = new com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks({
            onConnected: function(connectionHint) {
                console.log("onConnected: " + connectionHint);

                GoogleApi.LocationServices.GeofencingApi.addGeofences(
                    mGoogleApiClient,
                    getGeofencingRequest(),
                    getGeofencePendingIntent()
                ); //.setResultCallback(this);
            },
            onConnectionSuspended: function(cause) {
                console.log("onConnectionSuspended: " + cause);
            }
        });

        var connectionFailedListeners = new com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener({
            onConnectionFailed: function(result) {
                console.log("onConnectionFailed: " + result);
            }
        });

        mGoogleApiClient = new com.google.android.gms.common.api.GoogleApiClient.Builder(context)
            .addConnectionCallbacks(connectionListeners)
            .addOnConnectionFailedListener(connectionFailedListeners)
            .addApi(GoogleApi.LocationServices.API)
            .build();

        mGoogleApiClient.connect();

        // console.log(geofanceEvent);
        // console.log(geofancePoint);
        // console.log(intentService);
        // console.log(request);
        // console.log(intent);

    };

    return viewModel;
}

exports.createViewModel = createViewModel;