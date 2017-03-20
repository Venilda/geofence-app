android.support.v4.content.WakefulBroadcastReceiver.extend("com.tns.broadcastreceivers.NotificationEventReceiver", {
    onReceive: function(context, intent) {
        console.log('1 onReceive() in the com.tns.broadcastreceivers.NotificationEventReceiver');
        console.log('-------------------------------------------------------------------');
        var action = intent.getAction();
        var serviceIntent = null;
        if ("ACTION_START_NOTIFICATION_SERVICE" == action) {
            console.log("onReceive from alarm, starting notification service! thread: " + java.lang.Thread.currentThread().getName());
            console.log('1-A set serviceIntent = createIntentStartNotificationService(context);');
            console.log('-------------------------------------------------------------------');
            serviceIntent = createIntentStartNotificationService(context);
        } else if ("ACTION_DELETE_NOTIFICATION" == action) {
            console.log("1.B onReceive delete notification action, starting notification service to handle delete");
            serviceIntent = createIntentDeleteNotification(context);
        }

        if (serviceIntent) {
            console.log('1.c serviceIntent e razlichen ot dvata ifa');
            console.log('-------------------------------------------------------------------');
            android.support.v4.content.WakefulBroadcastReceiver.startWakefulService(context, serviceIntent);
        }
    }
})

var Intent = android.content.Intent;


function createIntentStartNotificationService(context) {
    console.log('2 createIntentStartNotificationService()');
    console.log('-------------------------------------------------------------------');
    var intent = new Intent(context, com.tns.notifications.NotificationIntentService.class);
    intent.setAction("ACTION_START");
    return intent;
}

function createIntentDeleteNotification(context) {
    console.log('3');
    console.log('-------------------------------------------------------------------');
    var intent = new Intent(context, com.tns.notifications.NotificationIntentService.class);
    intent.setAction("ACTION_DELETE");
    return intent;
}