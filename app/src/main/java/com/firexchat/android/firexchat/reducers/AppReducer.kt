/**
 * Created by Andrey Germanov on 5/24/18.
 */
package com.firexchat.android.firexchat.reducers

import com.firexchat.android.firexchat.actions.AppState
import tw.geothings.rekotlin.Action

/**
 * Root application reducer, used to apply actions to application state
 *
 * @param action: Action to apply
 * @param state: Application state before applying action
 * @return Application state after applying action
 */
fun appReducer(action: Action, state: AppState?):AppState {
    var state = state ?: AppState()
    when (action) {
        is AppState.changeScreen -> state = state.copy(currentScreen = action.screen)
    }
    return state
}