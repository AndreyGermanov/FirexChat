package com.firexchat.android.firexchat.firebase

import android.support.test.InstrumentationRegistry
import android.support.test.runner.AndroidJUnit4
import com.google.firebase.auth.FirebaseAuth

import org.junit.Test
import org.junit.runner.RunWith

import org.junit.Assert.*

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class AuthTest {
    @Test
    fun registerUserTest() {
        val fbAuth = FirebaseAuth.getInstance()
        val user = fbAuth.currentUser
        println()
        fun deleteCurrentUser(callback:()->Unit) {
            if (user != null) {
                user.delete().addOnCompleteListener {
                    fbAuth.signOut()
                    callback()
                }
            } else {
                callback()
            }
        }
        println("BEGIN")
        deleteCurrentUser {
            fbAuth.createUserWithEmailAndPassword("andrey@it-port.ru","111111").addOnCompleteListener {
                if (!it.isSuccessful) {
                    println("THERE")
                    assertNotNull("Should sign in current User",fbAuth.currentUser)
                    assertEquals("Should login registered user",fbAuth.currentUser!!.email,"andrey@it-port.ru")
                } else {
                    println("HERE")
                    fail("Could not register user")
                }
            }
        }
    }
}
