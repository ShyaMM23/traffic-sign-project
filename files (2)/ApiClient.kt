package com.trafficai

import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import java.io.File
import java.util.concurrent.TimeUnit

data class PredictionResponse(
    @SerializedName("class") val detectedClass: String,
    @SerializedName("confidence") val confidence: Float
)

object ApiClient {

    // Change this IP to your machine's local IP when testing on a real device
    // Use 10.0.2.2 for Android emulator, or your LAN IP for real devices
    private const val BASE_URL = "http://10.0.2.2:8000"

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    private val gson = Gson()

    suspend fun predict(imageFile: File): Result<PredictionResponse> {
        return try {
            val requestBody = MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart(
                    "file",
                    imageFile.name,
                    imageFile.asRequestBody("image/*".toMediaTypeOrNull())
                )
                .build()

            val request = Request.Builder()
                .url("$BASE_URL/predict/")
                .post(requestBody)
                .build()

            val response = client.newCall(request).execute()

            if (response.isSuccessful) {
                val body = response.body?.string() ?: throw Exception("Empty response")
                val result = gson.fromJson(body, PredictionResponse::class.java)
                Result.success(result)
            } else {
                Result.failure(Exception("Server error: ${response.code}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
