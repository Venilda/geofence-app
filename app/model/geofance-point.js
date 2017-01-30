var GoogleApi = com.google.android.gms.location;

function geofancePoint() {
    let geofance = new GoogleApi.Geofence.Builder()
        .setRequestId("Obecto")
        .setCircularRegion(
            42.6622177,
            23.3176289,
            10
        ).setExpirationDuration(12 * 60 * 60 * 1000)
        .setTransitionTypes(1 | 2)
        .build();

    return geofance;
}
exports.geofancePoint = geofancePoint;