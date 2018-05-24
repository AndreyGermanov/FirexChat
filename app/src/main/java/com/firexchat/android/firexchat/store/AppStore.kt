/**
 * Created by Andrey Germanov on 5/24/18.
 */
package com.firexchat.android.firexchat.store

import com.firexchat.android.firexchat.actions.AppState
import com.firexchat.android.firexchat.reducers.appReducer
import tw.geothings.rekotlin.Store

/**
 * Application redux store, used to manage Global Application state via Redux
 * flow
 */
val appStore = Store(
        reducer = ::appReducer,
        state = null
)


