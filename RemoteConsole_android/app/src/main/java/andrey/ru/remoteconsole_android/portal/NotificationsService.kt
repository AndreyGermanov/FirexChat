package andrey.ru.remoteconsole_android.portal

import android.app.IntentService
import android.content.Intent
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage


// TODO: Rename actions, choose action names that describe tasks that this
// IntentService can perform, e.g. ACTION_FETCH_NEW_ITEMS
const val ACTION_FOO = "andrey.ru.remoteconsole_android.portal.action.FOO"
const val ACTION_BAZ = "andrey.ru.remoteconsole_android.portal.action.BAZ"

// TODO: Rename parameters
const val EXTRA_PARAM1 = "andrey.ru.remoteconsole_android.portal.extra.PARAM1"
const val EXTRA_PARAM2 = "andrey.ru.remoteconsole_android.portal.extra.PARAM2"

/**
 * An [IntentService] subclass for handling asynchronous task requests in
 * a service on a separate handler thread.
 * TODO: Customize class - update intent actions and extra parameters.
 */
class NotificationsService : FirebaseMessagingService() {
    override fun onMessageReceived(message:RemoteMessage?) {
        message?.notification?.let {
            if (it.body != null) TerminalServer.onReceivePushNotification(it.body!!)
        }
    }
}
