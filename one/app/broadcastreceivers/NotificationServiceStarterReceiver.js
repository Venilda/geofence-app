android.content.BroadcastReceiver.extend("com.tns.broadcastreceivers.NotificationServiceStarterReceiver", {
    onReceive: function() {
        console.log('4');
        console.log('-------------------------------------');
        var helper = require("../service-helper");
        var utils = require("utils/utils");
        helper.setupAlarm(utils.ad.getApplicationContext());
    }
});