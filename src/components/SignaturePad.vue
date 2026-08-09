<template>
  <div class="space-y-3">
    <!-- Mode Tabs: Draw Signature vs Type Signature -->
    <div class="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-2">
      <div class="flex items-center gap-2">
        <button 
          type="button"
          @click="mode = 'draw'" 
          class="px-3 py-1 rounded-lg text-xs font-bold transition-colors"
          :class="mode === 'draw' ? 'bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/30' : 'dark:text-slate-400 text-slate-600 hover:bg-slate-800/40'"
        >
          <PenTool class="w-3.5 h-3.5 inline-block mr-1" />
          <span>Draw Signature</span>
        </button>
        <button 
          type="button"
          @click="mode = 'type'" 
          class="px-3 py-1 rounded-lg text-xs font-bold transition-colors"
          :class="mode === 'type' ? 'bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/30' : 'dark:text-slate-400 text-slate-600 hover:bg-slate-800/40'"
        >
          <Type class="w-3.5 h-3.5 inline-block mr-1" />
          <span>Type Signature</span>
        </button>
      </div>

      <button 
        v-if="hasSignature" 
        @click="clearSignature" 
        type="button"
        class="text-xs text-red-500 hover:underline flex items-center gap-1"
      >
        <RotateCcw class="w-3 h-3" />
        <span>Clear</span>
      </button>
    </div>

    <!-- Mode 1: HTML5 Canvas Draw Pad -->
    <div v-if="mode === 'draw'" class="relative">
      <canvas 
        ref="canvasRef"
        width="500"
        height="150"
        class="w-full h-36 rounded-2xl border-2 border-dashed dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-slate-50 cursor-crosshair touch-none"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend.prevent="stopDrawing"
      ></canvas>

      <span v-if="!hasSignature" class="absolute inset-0 flex items-center justify-center pointer-events-none text-xs dark:text-slate-600 text-slate-400 font-medium">
        Sign with finger or mouse here
      </span>
    </div>

    <!-- Mode 2: Type Signature Input -->
    <div v-else class="space-y-2">
      <input 
        v-model="typedName" 
        @input="onTypeInput"
        type="text" 
        placeholder="Type full legal name here" 
        class="input-field font-serif text-lg tracking-wide italic"
      />
      <div v-if="typedName" class="p-4 rounded-xl dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 text-center font-serif text-2xl italic dark:text-slate-200 text-slate-800">
        {{ typedName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { PenTool, Type, RotateCcw } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  applicantName: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const mode = ref('draw')
const canvasRef = ref(null)
const isDrawing = ref(false)
const hasSignature = ref(false)
const typedName = ref(props.applicantName || '')

let ctx = null

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#ee2824'
    }
  }
})

function startDrawing(e) {
  isDrawing.value = true
  hasSignature.value = true
  const { offsetX, offsetY } = getCoordinates(e)
  if (ctx) {
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
  }
}

function draw(e) {
  if (!isDrawing.value || !ctx) return
  const { offsetX, offsetY } = getCoordinates(e)
  ctx.lineTo(offsetX, offsetY)
  ctx.stroke()
}

function stopDrawing() {
  if (!isDrawing.value) return
  isDrawing.value = false
  if (ctx && canvasRef.value) {
    ctx.closePath()
    const dataUrl = canvasRef.value.toDataURL('image/png')
    emit('update:modelValue', dataUrl)
  }
}

function getCoordinates(e) {
  if (!canvasRef.value) return { offsetX: 0, offsetY: 0 }
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  return {
    offsetX: (e.clientX - rect.left) * scaleX,
    offsetY: (e.clientY - rect.top) * scaleY
  }
}

function handleTouchStart(e) {
  if (e.touches.length > 0) {
    const touch = e.touches[0]
    startDrawing(touch)
  }
}

function handleTouchMove(e) {
  if (e.touches.length > 0) {
    const touch = e.touches[0]
    draw(touch)
  }
}

function onTypeInput() {
  hasSignature.value = typedName.value.length > 0
  if (typedName.value) {
    emit('update:modelValue', `TYPED:${typedName.value}`)
  } else {
    emit('update:modelValue', '')
  }
}

function clearSignature() {
  hasSignature.value = false
  typedName.value = ''
  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
  emit('update:modelValue', '')
}
</script>
