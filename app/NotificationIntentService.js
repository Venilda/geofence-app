android.app.IntentService.extend("com.tns.notifications.NotificationIntentService" /* give your class a valid name as it will need to be declared in the AndroidManifest later */ , {
    onHandleIntent: function(intent) {
        var GoogleApi = com.google.android.gms.location;

        //var action = intent.getAction();
        //if (action == "GEOFENSE_UPDATE") {
        var geofencingEvent = GoogleApi.GeofencingEvent.fromIntent(intent);

        if (geofencingEvent.hasError()) {
            var errorMessage = GoogleApi.GeofenceErrorMessages.getErrorString(this,
                geofencingEvent.getErrorCode());

            console.log(errorMessage);
            return;
        }

        // Get the transition type.
        var geofenceTransition = geofencingEvent.getGeofenceTransition();

        // Test that the reported transition was of interest.
        if (geofenceTransition == GoogleApi.Geofence.GEOFENCE_TRANSITION_ENTER ||
            geofenceTransition == GoogleApi.Geofence.GEOFENCE_TRANSITION_EXIT) {

            // Get the geofences that were triggered. A single event can trigger
            // multiple geofences.
            var triggeringGeofences = geofencingEvent.getTriggeringGeofences();

            // Get the transition details as a String.
            var geofenceTransitionDetails = getGeofenceTransitionDetails(
                this,
                geofenceTransition,
                triggeringGeofences
            );

            // Send notification and log the transition details.
            //sendNotification(geofenceTransitionDetails);
            console.log(geofenceTransitionDetails);
        } else {
            // Log the error.
            console.log(geofenceTransition);
        }
        //}
    }
});