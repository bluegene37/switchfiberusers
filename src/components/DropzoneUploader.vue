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
          <div class="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border dark:border-slate-700 border-slate-300">
            <img v-if="filePreviewUrl" :src="filePreviewUrl" alt="File preview" class="w-full h-full object-cover" />
            <FileCheck v-else class="w-6 h-6 text-emerald-500" />
          </div>
          <div class="text-left overflow-hidden">
            <p class="text-xs font-bold dark:text-white text-slate-900 truncate max-w-[200px] sm:max-w-[280px]">
              {{ fileName }}
            </p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 class="w-3 h-3" />
                <span>Uploaded</span>
              </span>
              <span v-if="fileSize" class="text-[10px] dark:text-slate-400 text-slate-500 font-mono">{{ fileSize }}</span>
            </div>
          </div>
        </div>

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

      <!-- State 2: Default Empty / Dragging Dropzone prompt -->
      <div v-else class="space-y-1.5 py-2">
        <div class="w-10 h-10 rounded-full bg-[#ee2824]/10 dark:bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center mx-auto transition-transform duration-200" :class="isDragging ? 'scale-125' : ''">
          <UploadCloud class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs font-bold dark:text-slate-200 text-slate-800">
            <span class="text-[#ee2824] dark:text-[#ff6b67] underline underline-offset-2">Click to upload</span> or drag and drop
          </p>
          <p class="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
            JPG, PNG, WEBP or PDF (MAX 10MB)
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { UploadCloud, FileCheck, CheckCircle2, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  fileName: { type: String, default: '' },
  accept: { type: String, default: 'image/*,.pdf' },
  error: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'update:fileName', 'change'])

const fileInputRef = ref(null)
const isDragging = ref(false)
const filePreviewUrl = ref('')
const fileSize = ref('')

// Initialize preview if modelValue has base64 data
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.startsWith('data:image')) {
    filePreviewUrl.value = newVal
  } else if (!newVal) {
    filePreviewUrl.value = ''
    fileSize.value = ''
  }
}, { immediate: true })

function triggerFilePicker() {
  fileInputRef.value?.click()
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

function processFile(file) {
  if (!file) return

  fileSize.value = formatBytes(file.size)
  const name = file.name
  emit('update:fileName', name)

  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result || ''
    if (file.type.startsWith('image/')) {
      filePreviewUrl.value = base64
    } else {
      filePreviewUrl.value = ''
    }
    emit('update:modelValue', base64)
    emit('change', { name, base64, file })
  }
  reader.readAsDataURL(file)
}

function removeFile() {
  filePreviewUrl.value = ''
  fileSize.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
  emit('update:modelValue', '')
  emit('update:fileName', '')
  emit('change', { name: '', base64: '', file: null })
}
</script>
