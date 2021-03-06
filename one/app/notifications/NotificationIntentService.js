com.pip3r4o.android.app.IntentService.extend("com.tns.notifications.NotificationIntentService", {
    onHandleIntent: function(intent) {
        console.log("onHandleIntent() tuk sam");
        var action = intent.getAction();
        if ("ACTION_START" == action) {
            proba(intent);
        }

        android.support.v4.content.WakefulBroadcastReceiver.completeWakefulIntent(intent);
    }
});

function proba(intent) {
    let GoogleApi = com.google.android.gms.location;
    let ArrayList = java.util.ArrayList;
    let geofence = com.google.android.gms.location.Geofence;

    let geofencingEvent = GoogleApi.GeofencingEvent.fromIntent(intent);
    console.log("Intent Service Called!!!");

    if (geofencingEvent.hasError()) {

        console.log('Error in the hasErrow ' + geofencingEvent.getErrorCode());
        return;
    }

    let geofenceTransition = geofencingEvent.getGeofenceTransition();
    console.log(geofenceTransition);

    // Test that the reported transition was of interest.
    if (geofenceTransition === GoogleApi.Geofence.GEOFENCE_TRANSITION_ENTER || geofenceTransition === GoogleApi.Geofence.GEOFENCE_TRANSITION_EXIT) {

        // Get the geofences that were triggered. A single event can trigger
        // multiple geofences.
        var utils = require("utils/utils");
        let triggeringGeofences = geofencingEvent.getTriggeringGeofences();

        let context = utils.ad.getApplicationContext();
        // Get the transition details as a String.
        let geofenceTransitionDetails = getGeofenceTransitionDetails(
            context,
            geofenceTransition,
            triggeringGeofences
        );
        sendNotification(geofenceTransitionDetails);
        // Send notification and log the transition details.
        //sendNotification(geofenceTransitionDetails);

    } else {
        // Log the error.
        console.log('No triggering!!!!!!!!');
    }

    function getGeofenceTransitionDetails(context, geofenceTransition, triggeringGeofences) {
        let geofenceTransitionString = getTransitionString(geofenceTransition); // Get the Ids of each geofence that was triggered.
        let triggeringGeofencesIdsList = '';

        for (let i = 0; i < triggeringGeofences.size(); i += 1) {
            let geofence = triggeringGeofences.get(i);
            console.log(geofence);
            triggeringGeofencesIdsList += geofence.getRequestId() + ", ";
        }
        console.log(triggeringGeofencesIdsList);

        return geofenceTransitionString + ": " + triggeringGeofencesIdsList;
    }

    function sendNotification(str) {
        return console.log(str);
    };

    function getTransitionString(transitionType) {
        switch (transitionType) {
            case GoogleApi.Geofence.GEOFENCE_TRANSITION_ENTER:
                return 'Entered';
            case GoogleApi.Geofence.GEOFENCE_TRANSITION_EXIT:
                return 'Exited';
            default:
                return 'Unknou Transition';
        }
    }
}

function processStartNotification() {
    // Do something. For example, fetch fresh data from backend to create a rich notification?

    var utils = require("utils/utils");
    var context = utils.ad.getApplicationContext();

    var builder = new android.app.Notification.Builder(context);
    builder.setContentTitle("Scheduled Notification")
        .setAutoCancel(true)
        //.setColor(android.R.color.holo_purple)//getResources().getColor(R.color.colorAccent))
        .setContentText("This notification has been triggered by Notification Service")
        .setVibrate([100, 200, 100])
        .setSmallIcon(android.R.drawable.btn_star_big_on);

    // will open main NativeScript activity when the notification is pressed
    var mainIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class);
    var pendingIntent = android.app.PendingIntent.getActivity(context,
        1,
        mainIntent,
        android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    builder.setContentIntent(pendingIntent);
    builder.setDeleteIntent(getDeleteIntent(context));

    var manager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
    manager.notify(1, builder.build());
}

function getDeleteIntent(context) {
    var intent = new android.content.Intent(context, com.tns.broadcastreceivers.NotificationEventReceiver.class);
    intent.setAction("ACTION_DELETE_NOTIFICATION");
    return android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
}