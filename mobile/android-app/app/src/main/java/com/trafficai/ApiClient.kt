package com.trafficai

import android.util.Log
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.util.concurrent.TimeUnit

// 1. Data Model
data class PredictionResponse(
    @SerializedName("class") val detectedClass: String,
    @SerializedName("confidence") val confidence: Float
)

// 2. API Client Object
object ApiClient {
    private const val TAG = "ApiClient"

    // Use 10.0.2.2 for Emulator, or your PC's IP (e.g., 192.168.1.5) for real devices
    private const val BASE_URL = "http://10.0.2.2:5000"

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    private val gson = Gson()

    suspend fun predict(imageFile: File): Result<PredictionResponse> = withContext(Dispatchers.IO) {
        return@withContext try {
            // Check if file is valid before sending
            if (!imageFile.exists() || imageFile.length() == 0L) {
                return@withContext Result.failure(Exception("File does not exist or is empty"))
            }

            Log.d(TAG, "Uploading file: ${imageFile.absolutePath}")

            val requestBody = MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart(
                    "file",
                    imageFile.name,
                    imageFile.asRequestBody("image/*".toMediaTypeOrNull())
                )
                .build()

            val request = Request.Builder()
                .url("$BASE_URL/detect")
                .post(requestBody)
                .build()

            // Use .execute().use { ... } to ensure the response body stream is closed properly
            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val bodyString = response.body?.string()

                    if (!bodyString.isNullOrBlank()) {
                        Log.d(TAG, "Raw Response: $bodyString")
                        val result = gson.fromJson(bodyString, PredictionResponse::class.java)
                        Result.success(result)
                    } else {
                        Result.failure(Exception("Response body was empty"))
                    }
                } else {
                    val errorMsg = "Server Error: ${response.code} - ${response.message}"
                    Log.e(TAG, errorMsg)
                    Result.failure(Exception(errorMsg))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Network Exception: ${e.message}", e)
            Result.failure(e)
        }
    }
}
