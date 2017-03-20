function getStartPendingIntent(context) {
    var intent = new android.content.Intent(context, com.tns.broadcastreceivers.NotificationEventReceiver.class);
    intent.setAction("ACTION_START_NOTIFICATION_SERVICE");
    return android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
}

function setupAlarm(context) {
    var alarmManager = context.getSystemService(android.content.Context.ALARM_SERVICE);
    var alarmIntent = setGeofence(context);
    // alarmManager.setRepeating(android.app.AlarmManager.RTC_WAKEUP,
    //     java.lang.System.currentTimeMillis(),
    //     1000 * 60, // <- every 5 minutes // 1000 * 60 * 60 * 24, /* alarm will send the `alarmIntent` object every 24h */
    //     alarmIntent);
}

function setGeofence(context) {

    var GoogleApiClient = com.google.android.gms.common.api.GoogleApiClient;
    var ResultCallback = com.google.android.gms.common.api.ResultCallback;
    var LocationServices = com.google.android.gms.location.LocationServices;
    var ArrayList = java.util.ArrayList;
    var GoogleApi = com.google.android.gms.location;
    var GEOFENCE_RADIUS = 10;

    var geofences = [];
    var geofencePendingIntent = null;
    var geofencingRequest;
    var geofencePointsList = [];
    var googleApiClient;
    var googleIsConnect;

    var chainsData = [{
        "name": "lilly",
        "stores": [{
            "name": "Ilian",
            "city": "Sofia",
            "lat": 42.657607,
            "lng": 23.369960
        }, {
            "name": "Obecto",
            "city": "Sofia",
            "lat": 42.66251948309662,
            "lng": 23.31786286085844
        }, {
            "name": "Venko",
            "city": "Sliven",
            "lat": 42.682212,
            "lng": 26.321026
        }]
    }];

    initialize(chainsData, context);

    function initialize(chainsData, context) {
        let _this = this;
        if (googleApiClient && googleApiClient.isConnected()) {
            googleApiClient.disconnect();
        }

        //This callback will be executed within the Java context - keep in mind scope chain might be broken!!!
        let onConnectedCallbackGoogle = function() {
            let geofencesList = [];

            chainsData.forEach(chain => {
                chain.stores.forEach(store => {
                    let geofence = {
                        id: store.name,
                        chain: chain,
                        store: store
                    };

                    // _this.geofences[chain.name] = geofence;
                    geofencesList.push(geofence);
                });
            });
            googleIsConnect = googleApiClient.isConnected();
            addGeofences(geofencesList, context);
        };

        googleApiClient = initializeBuildGoogleApiClient(context, onConnectedCallbackGoogle);

        googleApiClient.connect();
    }

    function initializeBuildGoogleApiClient(context, onConnectedCallbackGoogle) {
        googleApiClient = new GoogleApiClient.Builder(context)
            .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks({
                onConnected: function() {
                    console.log('Connected to google api!');
                    onConnectedCallbackGoogle();
                }.bind(context),
                onConnectionSuspended: function() {
                    console.log('Conection susspend');
                }.bind(context),
            }))
            .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener({
                onConnectionFailed: function(result) {
                    console.log('Connection failed: connection result ' + result);
                }.bind(context),
            }))
            .addApi(LocationServices.API)
            .build();

        return googleApiClient;
    }

    function createGeofencePoints(geofencesList) {
        let geofencePointsList = new ArrayList();

        geofencesList.forEach(geofence => {
            let geofencePoint = new GoogleApi.Geofence.Builder()
                .setRequestId(geofence.chain.name)
                .setCircularRegion(
                    geofence.store.lat,
                    geofence.store.lng,
                    GEOFENCE_RADIUS
                )
                .setExpirationDuration(12 * 60 * 60 * 1000)
                .setTransitionTypes(1 | 2)
                .build();

            geofencePointsList.add(geofencePoint);
            console.log('Created geofence!');
        });

        return geofencePointsList;
    }

    function getGeofencingRequest(geofancePointsList) {
        let builder = new GoogleApi.GeofencingRequest.Builder()
        builder.setInitialTrigger(GoogleApi.GeofencingRequest.INITIAL_TRIGGER_ENTER)
        builder.addGeofences(geofancePointsList);

        let request = builder.build();
        console.log('geofence request ready! ' + request);

        return request;
    }
    //var Intent = android.connect.Intent;
    function getGeofencePendingIntent(context) {
        var intent = new android.content.Intent(context, com.tns.notifications.NotificationIntentService.class);
        intent.setAction("ACTION_START");
        android.support.v4.content.WakefulBroadcastReceiver.startWakefulService(context, intent);
        return android.app.PendingIntent.getService(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    }

    function addGeofences(geofencesList, context) {

        geofencePointsList = createGeofencePoints(geofencesList);
        geofencingRequest = getGeofencingRequest(geofencePointsList);
        geofencePendingIntent = getGeofencePendingIntent(context); //this.getGeofencePendingIntent(geofencingRequest);
        console.log("------------------------------");
        console.log(geofencePointsList);
        console.log("------------------------------");
        console.log("------------------------------");
        console.log(geofencingRequest);
        console.log("------------------------------");
        console.log("------------------------------");
        console.log(geofencePendingIntent);
        console.log("------------------------------");
        if (!googleIsConnect) {
            console.log('No connected googleAPI!');
        }
        try {
            console.log("LocationServices - start");
            let locationService = LocationServices.GeofencingApi;
            locationService.addGeofences(
                googleApiClient,
                geofencingRequest,
                geofencePendingIntent).setResultCallback(new ResultCallback({
                onResult: (statuss) => {
                    console.log(statuss);
                }
            }));
            console.log("LocationServices - end");

            console.log('Geofence event listen!!!');
        } catch (ex) {
            console.log(ex);
        }
    }
}

module.exports.setupAlarm = setupAlarm;