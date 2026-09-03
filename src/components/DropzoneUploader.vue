<template>
  <div class="space-y-2">
    <!-- Hidden File Input for Native Picker -->
    <input 
      ref="fileInputRef" 
      type="file" 
      :accept="accept" 
      class="hidden" 
      @change="onFileSelected" 
    />

    <!-- Separate input so the camera button opens the real device camera
         instead of the file browser -->
    <input
      ref="cameraInputRef"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="onFileSelected"
    />

    <!-- Dropzone Area (Dropzone.dev styling) -->
    <div 
      class="relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center min-h-[120px] select-none"
      :class="[
        isDragging 
          ? 'border-[#ee2824] bg-[#ee2824]/10 dark:bg-[#ee2824]/15 shadow-lg shadow-[#ee2824]/20 scale-[1.01]' 
          : fileName 
            ? 'border-emerald-500/60 dark:border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10' 
            : error 
              ? 'border-[#ee2824] bg-[#ee2824]/5 dark:border-[#ee2824]/60'
              : optional
                ? 'dark:border-slate-700 border-slate-300 dark:bg-slate-900/60 bg-slate-50 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                : 'dark:border-slate-700 border-slate-300 dark:bg-slate-900/60 bg-slate-50 hover:border-[#ee2824]/60 dark:hover:border-[#ee2824]/60 hover:bg-slate-100 dark:hover:bg-slate-800/60'
      ]"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFilePicker"
    >
      
      <!-- State 1: File Uploaded Preview -->
      <div v-if="fileName" class="w-full flex items-center justify-between gap-3 px-2 py-1 animate-in fade-in duration-200">
        <div class="flex items-center gap-3 overflow-hidden">
          <!-- Thumbnail image or File icon -->
          <div
            @click.stop="openLightbox"
            class="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border dark:border-slate-700 border-slate-300 relative group cursor-zoom-in"
            title="Click to view full preview"
          >
            <img v-if="filePreviewUrl" :src="filePreviewUrl" alt="File preview" class="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
            <FileCheck v-else class="w-6 h-6 text-emerald-500" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
              <Eye class="w-4 h-4" />
            </div>
          </div>

          <div class="text-left overflow-hidden">
            <p class="text-xs font-bold dark:text-white text-slate-900 truncate max-w-[180px] sm:max-w-[240px]">
              {{ fileName }}
            </p>
            <div class="flex items-center gap-2 mt-0.5 flex-wrap">
              <span class="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 class="w-3 h-3" />
                <span>Uploaded</span>
              </span>
              <span v-if="fileSize" class="text-[10px] dark:text-slate-400 text-slate-500 font-mono">
                {{ fileSize }}<template v-if="compressedSize"> → {{ compressedSize }}</template>
              </span>
              <span v-if="compressedSize" class="text-[10px] font-semibold text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded-full">Compressed</span>
            </div>
            <div v-if="displayExif" class="flex items-center gap-2 mt-1 flex-wrap text-[10px] dark:text-slate-400 text-slate-500">
              <span v-if="displayExif.lat !== null && displayExif.lat !== undefined" class="flex items-center gap-1 font-mono" title="GPS location embedded in the photo">
                <MapPin class="w-3 h-3 text-[#ee2824] dark:text-[#ff6b67] shrink-0" />
                {{ displayExif.lat.toFixed(5) }}, {{ displayExif.lng.toFixed(5) }}
              </span>
              <span v-if="displayExif.takenAt" class="flex items-center gap-1" title="Date the photo was taken">
                <Clock class="w-3 h-3 shrink-0" />
                {{ formatTakenAt(displayExif.takenAt) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <!-- View Lightbox button -->
          <button 
            v-if="filePreviewUrl"
            @click.stop="openLightbox" 
            type="button"
            class="p-2 rounded-xl text-slate-400 hover:text-[#ee2824] hover:bg-slate-800/50 transition-colors shrink-0"
            title="View enlarged image"
          >
            <Maximize2 class="w-4 h-4" />
          </button>

          <!-- Remove file button -->
          <button 
            @click.stop="removeFile" 
            type="button"
            class="p-2 rounded-xl text-slate-400 hover:text-[#ee2824] hover:bg-red-500/10 transition-colors shrink-0"
            title="Remove or replace file"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- State 2: Default Empty / Dragging Dropzone prompt -->
      <div v-else class="space-y-2 py-2">
        <div class="flex items-center justify-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200"
            :class="[
              isDragging ? 'scale-125' : '',
              optional
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                : 'bg-[#ee2824]/10 dark:bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67]'
            ]"
          >
            <UploadCloud class="w-5 h-5" />
          </div>
          <button 
            @click.stop="triggerCameraSnapshot"
            type="button"
            class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#ee2824] hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            title="Snap photo with camera"
          >
            <Camera class="w-5 h-5" />
          </button>
        </div>
        <div>
          <p class="text-xs font-bold dark:text-slate-200 text-slate-800">
            <span
              class="underline underline-offset-2"
              :class="optional
                ? 'text-slate-600 dark:text-slate-300'
                : 'text-[#ee2824] dark:text-[#ff6b67]'"
            >Click to upload</span> or drag and drop
          </p>
          <p class="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
            JPG, PNG, WEBP or PDF (MAX 10MB)
          </p>
        </div>
      </div>

    </div>

    <p v-if="rejectionMessage" role="alert" class="text-[11px] text-[#ee2824] font-medium flex items-start gap-1">
      <AlertCircle class="w-3.5 h-3.5 shrink-0 mt-px" />
      <span>{{ rejectionMessage }}</span>
    </p>

    <!-- Lightbox Modal — teleported to body so the surrounding .glass-panel's
         backdrop-filter doesn't become the containing block for position:fixed -->
    <Teleport to="body">
    <div v-if="isLightboxOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200" @click="closeLightbox">
      <div class="relative max-w-4xl max-h-[90vh] p-2 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden" @click.stop>
        <button 
          @click="closeLightbox" 
          class="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-red-500 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
        <img v-if="filePreviewUrl" :src="filePreviewUrl" alt="Enlarged Document" class="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain mx-auto" />
        <div class="p-3 text-center text-xs dark:text-slate-300 font-semibold">
          {{ fileName }}
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { UploadCloud, FileCheck, CheckCircle2, Trash2, Camera, Eye, Maximize2, X, AlertCircle, MapPin, Clock } from 'lucide-vue-next'
import exifr from 'exifr'

const props = defineProps({
  modelValue: { type: String, default: '' },
  fileName: { type: String, default: '' },
  accept: { type: String, default: 'image/*,.pdf' },
  error: { type: Boolean, default: false },
  // Optional uploads render in neutral slate. The brand red reads as
  // "required" (or worse, as an error), which is misleading on a field
  // the applicant can safely skip.
  optional: { type: Boolean, default: false },
  // EXIF metadata extracted from the photo ({ lat, lng, takenAt, camera }).
  // Held by the parent so it survives this component unmounting between steps.
  exif: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'update:fileName', 'update:exif', 'change'])

const fileInputRef = ref(null)
const cameraInputRef = ref(null)
const isDragging = ref(false)
const rejectionMessage = ref('')

const MAX_FILE_BYTES = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
const filePreviewUrl = ref('')
const fileSize = ref('')
const compressedSize = ref('')
const isLightboxOpen = ref(false)

// Long edges beyond this add nothing for document review but multiply the
// in-memory base64 payload; phones commonly produce 4000px+ photos.
const COMPRESS_MAX_DIMENSION = 1600
const COMPRESS_QUALITY = 0.8
// Files already this small rarely shrink further; re-encoding them just
// burns CPU and can even grow PNGs of text documents.
const COMPRESS_THRESHOLD_BYTES = 300 * 1024

const localExif = ref(null)
const displayExif = computed(() => localExif.value || props.exif)

function formatTakenAt(iso) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' })
}

// Initialize preview if modelValue has base64 data
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.startsWith('data:image')) {
    filePreviewUrl.value = newVal
  } else if (!newVal) {
    // Cleared from outside (form reset, new application): drop every trace
    // of the previous file, including the native inputs, so the same photo
    // can be re-picked and nothing stale is shown.
    filePreviewUrl.value = ''
    fileSize.value = ''
    compressedSize.value = ''
    localExif.value = null
    isLightboxOpen.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
    if (cameraInputRef.value) cameraInputRef.value.value = ''
  }
}, { immediate: true })

function triggerFilePicker() {
  fileInputRef.value?.click()
}

function triggerCameraSnapshot() {
  cameraInputRef.value?.click()
}

function openLightbox() {
  if (filePreviewUrl.value) {
    isLightboxOpen.value = true
  }
}

function closeLightbox() {
  isLightboxOpen.value = false
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function onFileSelected(e) {
  const files = e.target?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function formatBytes(bytes) {
  if (!bytes) return ''
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('File could not be read'))
    reader.onload = (e) => resolve(e.target?.result || '')
    reader.readAsDataURL(file)
  })
}

// Pull the metadata that matters for dispatch verification: where and when
// the photo was taken, and on what device. Must run on the ORIGINAL file —
// canvas re-encoding strips EXIF.
async function extractExif(file) {
  try {
    const data = await exifr.parse(file, {
      pick: ['DateTimeOriginal', 'CreateDate', 'Make', 'Model',
             'GPSLatitude', 'GPSLongitude', 'GPSLatitudeRef', 'GPSLongitudeRef']
    })
    if (!data) return null
    const dmsToDecimal = (dms, ref) => {
      if (typeof dms === 'number') return (ref === 'S' || ref === 'W') ? -dms : dms
      if (!Array.isArray(dms) || dms.length < 1) return null
      const [d = 0, m = 0, s = 0] = dms
      const dec = d + m / 60 + s / 3600
      return (ref === 'S' || ref === 'W') ? -dec : dec
    }
    const lat = typeof data.latitude === 'number' ? data.latitude : dmsToDecimal(data.GPSLatitude, data.GPSLatitudeRef)
    const lng = typeof data.longitude === 'number' ? data.longitude : dmsToDecimal(data.GPSLongitude, data.GPSLongitudeRef)
    const rawDate = data.DateTimeOriginal || data.CreateDate || null
    const takenAt = rawDate && !isNaN(new Date(rawDate).getTime()) ? new Date(rawDate).toISOString() : null
    const camera = [data.Make, data.Model].filter(Boolean).join(' ').trim() || null
    if (lat === null && !takenAt && !camera) return null
    return { lat, lng, takenAt, camera }
  } catch (e) {
    // A photo without readable EXIF is still a perfectly good upload.
    return null
  }
}

async function compressImage(file) {
  let bitmap
  try {
    // createImageBitmap applies EXIF orientation, so the re-encoded copy
    // stays upright even though its metadata is gone.
    bitmap = await createImageBitmap(file)
  } catch (e) {
    return null // undecodable here (e.g. HEIC on some browsers) — keep the original
  }
  try {
    const scale = Math.min(1, COMPRESS_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    // JPEG has no alpha channel; without this a transparent PNG turns black.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(bitmap, 0, 0, w, h)
    return canvas.toDataURL('image/jpeg', COMPRESS_QUALITY)
  } finally {
    bitmap.close()
  }
}

function approxDataUrlBytes(dataUrl) {
  const base64Part = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.round(base64Part.length * 3 / 4)
}

async function processFile(file) {
  if (!file) return

  // The dropzone advertises these limits; enforce them rather than letting a
  // 40MB photo be read into memory and silently break the form.
  const looksAccepted = ACCEPTED_TYPES.includes(file.type) ||
    /\.(jpe?g|png|webp|heic|heif|pdf)$/i.test(file.name || '')
  if (!looksAccepted) {
    rejectionMessage.value = 'That file type is not supported. Please upload a JPG, PNG, WEBP or PDF.'
    return
  }
  if (file.size > MAX_FILE_BYTES) {
    rejectionMessage.value = `That file is ${formatBytes(file.size)}. Please upload a file under 10MB.`
    return
  }

  rejectionMessage.value = ''
  fileSize.value = formatBytes(file.size)
  compressedSize.value = ''
  const name = file.name
  const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif)$/i.test(name || '')

  try {
    let base64 = ''
    let meta = null

    if (isImage) {
      meta = await extractExif(file)
      const original = await readAsDataURL(file)
      const compressed = file.size > COMPRESS_THRESHOLD_BYTES ? await compressImage(file) : null
      if (compressed && compressed.length < original.length) {
        base64 = compressed
        compressedSize.value = formatBytes(approxDataUrlBytes(compressed))
      } else {
        base64 = original
      }
      filePreviewUrl.value = base64
    } else {
      base64 = await readAsDataURL(file)
      filePreviewUrl.value = ''
    }

    localExif.value = meta
    emit('update:fileName', name)
    emit('update:modelValue', base64)
    emit('update:exif', meta)
    emit('change', { name, base64, file, exif: meta })
  } catch (e) {
    rejectionMessage.value = 'We could not read that file. Please try another one.'
  }
}

function removeFile() {
  filePreviewUrl.value = ''
  fileSize.value = ''
  compressedSize.value = ''
  localExif.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
  if (cameraInputRef.value) cameraInputRef.value.value = ''
  rejectionMessage.value = ''
  emit('update:modelValue', '')
  emit('update:fileName', '')
  emit('update:exif', null)
  emit('change', { name: '', base64: '', file: null, exif: null })
}
</script>
