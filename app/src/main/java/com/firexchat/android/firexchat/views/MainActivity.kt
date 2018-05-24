package com.firexchat.android.firexchat.views

import android.net.Uri
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.NavigationView
import android.support.v4.view.GravityCompat
import android.support.v4.widget.DrawerLayout
import android.support.v7.widget.Toolbar
import android.util.Log
import android.view.MenuItem
import com.firexchat.android.firexchat.R
import com.firexchat.android.firexchat.actions.AppScreen
import com.firexchat.android.firexchat.actions.AppState
import com.firexchat.android.firexchat.store.appStore
import tw.geothings.rekotlin.StoreSubscriber

/**
 * Main activity of application, which contains menu and toolbar, which allows to
 * open this menu. Through menu user opens all other screens of application "Chat", "User profile"
 * and "Settings"
 */
class MainActivity : AppCompatActivity(),StoreSubscriber<AppState>,UserProfileScreen.OnFragmentInteractionListener {

    // Link to left menu drawer
    private lateinit var mDrawerLayout: DrawerLayout

    // Current application screen
    private var currentScreen = AppScreen.CHAT

    /**
     * Activity lifecycle method, called each time when activity constructed
     *
     * @param savedInstanceState: Saved state information as a bundle
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        val actionBar = supportActionBar
        actionBar?.apply {
            setDisplayHomeAsUpEnabled(true)
            setHomeAsUpIndicator(R.drawable.ic_menu)
        }
        mDrawerLayout = findViewById(R.id.drawer_layout)
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_chat -> appStore.dispatch(AppState.changeScreen(screen=AppScreen.CHAT))
                R.id.nav_profile -> appStore.dispatch(AppState.changeScreen(screen=AppScreen.USER_PROFILE))
                R.id.nav_settings -> appStore.dispatch(AppState.changeScreen(screen=AppScreen.SETTINGS))
            }
            mDrawerLayout.closeDrawers()
            true
        }
        appStore.subscribe(this)
    }

    /**
     * Callback function called when user clicks on menu item on top toolbar
     *
     * @param item: Link to clicked menu item
     * @return True or false
     */
    override fun onOptionsItemSelected(item: MenuItem?): Boolean {
        return when (item?.itemId) {
            android.R.id.home -> {
                mDrawerLayout.openDrawer(GravityCompat.START)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    /**
     * Method automatically called when Application state changed via reducer.
     * Should update User Interface according to state changes
     *
     * @param state: New application state
     */
    override fun newState(state: AppState) {
        if (state.currentScreen != currentScreen) {
            val transaction = supportFragmentManager.beginTransaction()
            when (state.currentScreen) {
                AppScreen.CHAT -> {
                    val fragment = ChatScreen()
                    transaction.replace(R.id.content_frame_fragment,fragment)
                }
                AppScreen.USER_PROFILE -> {
                    val fragment = UserProfileScreen()
                    transaction.replace(R.id.content_frame_fragment,fragment)

                }
                AppScreen.SETTINGS -> {
                    val fragment = SettingsScreen()
                    transaction.replace(R.id.content_frame_fragment,fragment)
                }
            }
            transaction.addToBackStack(null)
            transaction.commit()
            currentScreen = state.currentScreen
        }
    }

    /**
     * Method used to interract with fragments
     */
    override fun onFragmentInteraction(uri: Uri) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

}
