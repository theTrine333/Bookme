package com.tesla.bookme

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod

class PdfIntentModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "PdfIntent"

    @ReactMethod
    fun getInitialPdfPath(promise: Promise) {
        val uri = MainActivity.initialPdfUri
        if (uri != null) {
            promise.resolve(uri.toString())
        } else {
            promise.resolve(null)
        }
    }
}
