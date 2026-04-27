package com.trafficai

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import coil.load
import coil.transform.RoundedCornersTransformation
import com.google.android.material.snackbar.Snackbar
import com.trafficai.databinding.FragmentDetectBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import kotlin.math.roundToInt

class DetectFragment : Fragment() {

    private var _binding: FragmentDetectBinding? = null
    private val binding get() = _binding!!
    private var selectedImageUri: Uri? = null
    private var selectedImageFile: File? = null

    private val imagePickerLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == Activity.RESULT_OK) {
                result.data?.data?.let { uri ->
                    selectedImageUri = uri
                    selectedImageFile = copyUriToFile(uri)
                    showImagePreview(uri)
                }
            }
        }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDetectBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnPickImage.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK).apply { type = "image/*" }
            imagePickerLauncher.launch(intent)
        }

        binding.btnDetect.setOnClickListener {
            val file = selectedImageFile ?: return@setOnClickListener
            runDetection(file)
        }
    }

    private fun showImagePreview(uri: Uri) {
        binding.layoutEmpty.visibility = View.GONE
        binding.imgPreview.visibility = View.VISIBLE
        binding.imgPreview.load(uri) {
            crossfade(true)
            transformations(RoundedCornersTransformation(12f))
        }
        binding.btnDetect.isEnabled = true
        binding.cardResult.visibility = View.GONE
    }

    private fun runDetection(file: File) {
        binding.layoutLoading.visibility = View.VISIBLE
        binding.cardResult.visibility = View.GONE
        binding.btnDetect.isEnabled = false
        binding.btnPickImage.isEnabled = false

        lifecycleScope.launch {
            val result = withContext(Dispatchers.IO) { ApiClient.predict(file) }

            binding.layoutLoading.visibility = View.GONE
            binding.btnDetect.isEnabled = true
            binding.btnPickImage.isEnabled = true

            result.onSuccess { prediction ->
                binding.cardResult.visibility = View.VISIBLE
                binding.tvClass.text = prediction.detectedClass
                val pct = (prediction.confidence * 100).roundToInt()
                binding.tvConfidence.text = "$pct%"
                binding.progressConfidence.progress = pct
            }.onFailure { err ->
                Snackbar.make(
                    binding.root,
                    "Detection failed: ${err.message}",
                    Snackbar.LENGTH_LONG
                ).setAction("Retry") { runDetection(file) }.show()
            }
        }
    }

    private fun copyUriToFile(uri: Uri): File {
        val fileName = getFileName(uri) ?: "image_${System.currentTimeMillis()}.jpg"
        val file = File(requireContext().cacheDir, fileName)
        requireContext().contentResolver.openInputStream(uri)?.use { input ->
            FileOutputStream(file).use { output -> input.copyTo(output) }
        }
        return file
    }

    private fun getFileName(uri: Uri): String? {
        var name: String? = null
        requireContext().contentResolver.query(uri, null, null, null, null)?.use { cursor ->
            val idx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            if (cursor.moveToFirst() && idx >= 0) name = cursor.getString(idx)
        }
        return name
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}