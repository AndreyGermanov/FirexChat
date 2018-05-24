/**
 * Created by Andrey Germanov on 5/24/18.
 */

package com.firexchat.android.firexchat.actions

import tw.geothings.rekotlin.Action
import tw.geothings.rekotlin.StateType

/**
 * Class represents global application Redux state
 */
data class AppState(
        // Current application screen (by default is CHAT, but will change to LOGIN, if not
        // authorized)
        val currentScreen:AppScreen = AppScreen.CHAT
): StateType {
    data class changeScreen(val screen:AppScreen): AppAction()
}


/**
 * Possible screens of application
 */
enum class AppScreen {
    LOGIN,
    CHAT,
    USER_PROFILE,
    SETTINGS
}

/**
 * Base class for Application actions, used to distinguish application
 * actions from other actions in app reducer
 */
open class AppAction: Action