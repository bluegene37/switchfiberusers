<template>
  <div class="relative" ref="rootRef">
    <input
      ref="inputRef"
      type="text"
      :value="displayText"
      :placeholder="placeholder"
      :disabled="disabled"
      class="input-field pr-9"
      :class="statusClass"
      autocomplete="off"
      role="combobox"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @focus="openList"
      @click="openList"
      @input="onType"
      @keydown="onKeydown"
      @blur="onBlur"
    />
    <ChevronDown
      class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform"
      :class="isOpen ? 'rotate-180' : ''"
    />

    <div
      v-if="isOpen"
      class="absolute z-30 mt-1.5 w-full rounded-xl border dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-white shadow-2xl overflow-hidden"
    >
      <ul class="max-h-56 overflow-y-auto py-1 text-sm" role="listbox">
        <li v-if="loading" class="px-3.5 py-2.5 text-xs dark:text-slate-400 text-slate-500 flex items-center gap-2">
          <RotateCw class="w-3.5 h-3.5 animate-spin" />
          <span>Loading options…</span>
        </li>

        <li
          v-for="(opt, idx) in filteredOptions"
          :key="opt.value"
          role="option"
          :aria-selected="opt.value === modelValue"
          class="px-3.5 py-2 cursor-pointer flex items-center justify-between gap-2 transition-colors"
          :class="idx === activeIndex
            ? 'bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67]'
            : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'"
          @mousedown.prevent="selectOption(opt)"
          @mousemove="activeIndex = idx"
        >
          <span class="truncate">{{ opt.label }}</span>
          <Check v-if="opt.value === modelValue" class="w-3.5 h-3.5 shrink-0" />
        </li>

        <li
          v-if="!loading && filteredOptions.length === 0 && allowCustom && typedText.trim()"
          class="px-3.5 py-2 cursor-pointer text-[#ee2824] dark:text-[#ff6b67] font-medium"
          @mousedown.prevent="commitCustom"
        >
          Use "{{ typedText.trim() }}"
        </li>
        <li
          v-else-if="!loading && filteredOptions.length === 0"
          class="px-3.5 py-2.5 text-xs dark:text-slate-400 text-slate-500"
        >
          No matches found.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronDown, Check, RotateCw } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  // Strings or { value, label } objects
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Choose…' },
  // When true, text that matches no option is kept as the value on blur/Enter
  allowCustom: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  statusClass: { type: [String, Object, Array], default: '' }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const rootRef = ref(null)
const inputRef = ref(null)
const isOpen = ref(false)
const typedText = ref('')
// Until the user types, the full list is shown (like a native select)
const isDirty = ref(false)
const activeIndex = ref(-1)

const normalizedOptions = computed(() =>
  props.options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value }
  )
)

const displayText = computed(() => (isOpen.value && isDirty.value ? typedText.value : props.modelValue))

const filteredOptions = computed(() => {
  if (!isDirty.value || !typedText.value.trim()) return normalizedOptions.value
  const q = typedText.value.trim().toLowerCase()
  return normalizedOptions.value.filter(
    o => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
  )
})

watch(filteredOptions, opts => {
  if (activeIndex.value >= opts.length) activeIndex.value = opts.length ? 0 : -1
})

function openList() {
  if (props.disabled) return
  if (!isOpen.value) {
    isOpen.value = true
    isDirty.value = false
    typedText.value = ''
    activeIndex.value = normalizedOptions.value.findIndex(o => o.value === props.modelValue)
  }
  // Pre-select the current text so typing replaces it instead of appending.
  // Select immediately for the focus event, and once more on a timer because
  // the click's mouseup (which fires between focus and click) clears it.
  if (!isDirty.value) {
    inputRef.value?.select()
    setTimeout(() => {
      if (isOpen.value && !isDirty.value) inputRef.value?.select()
    }, 0)
  }
}

function closeList() {
  isOpen.value = false
  isDirty.value = false
  typedText.value = ''
  activeIndex.value = -1
}

function onType(e) {
  isDirty.value = true
  typedText.value = e.target.value
  isOpen.value = true
  activeIndex.value = filteredOptions.value.length ? 0 : -1
}

function selectOption(opt) {
  emit('update:modelValue', opt.value)
  closeList()
  inputRef.value?.blur()
}

function commitCustom() {
  const text = typedText.value.trim()
  if (text) emit('update:modelValue', text)
  closeList()
  inputRef.value?.blur()
}

function onKeydown(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!isOpen.value) return openList()
    const len = filteredOptions.value.length
    if (!len) return
    const delta = e.key === 'ArrowDown' ? 1 : -1
    activeIndex.value = (activeIndex.value + delta + len) % len
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const opt = filteredOptions.value[activeIndex.value] || filteredOptions.value[0]
    if (opt) selectOption(opt)
    else if (props.allowCustom) commitCustom()
  } else if (e.key === 'Escape') {
    closeList()
  }
}

function onBlur() {
  // Option clicks use mousedown.prevent, so a blur here means the user left
  // the field: keep an exact/custom match, otherwise fall back to the model.
  if (isDirty.value) {
    const text = typedText.value.trim()
    const exact = normalizedOptions.value.find(o => o.label.toLowerCase() === text.toLowerCase())
    if (exact) emit('update:modelValue', exact.value)
    else if (props.allowCustom && text) emit('update:modelValue', text)
  }
  closeList()
  emit('blur')
}
</script>
