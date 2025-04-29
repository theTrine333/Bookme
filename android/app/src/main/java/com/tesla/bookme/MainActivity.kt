package com.tesla.bookme

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper
import expo.modules.splashscreen.SplashScreenManager

class MainActivity : ReactActivity() {

  companion object {
    var initialPdfUri: Uri? = null
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    // Handle splash screen
    SplashScreenManager.registerOnActivity(this)

    // Handle incoming PDF intent
    val intent: Intent? = intent
    val data: Uri? = intent?.data
    val type: String? = intent?.type

    if (data != null && type == "application/pdf") {
      initialPdfUri = data
      Log.d("PDF_VIEWER", "Received PDF URI: $data")
    }

    super.onCreate(null)
  }

  override fun getMainComponentName(): String = "main"

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
      this,
      BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
      object : DefaultReactActivityDelegate(
        this,
        mainComponentName,
        fabricEnabled
      ) {}
    )
  }

  override fun invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        super.invokeDefaultOnBackPressed()
      }
      return
    }
    super.invokeDefaultOnBackPressed()
  }
}
