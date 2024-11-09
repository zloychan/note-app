<template>
  <div 
    class="loading-spinner-wrapper"
    :class="{ 'loading-overlay': overlay }"
    role="status"
  >
    <div 
      :class="[
        'spinner-wrapper d-flex align-items-center justify-content-center',
        fadeClass
      ]"
    >
      <div
        :class="[
          'spinner-border',
          sizeClass,
          variantClass
        ]"
        :style="customStyle"
      >
        <span class="sr-only" aria-live="polite">Loading...</span>
      </div>
      <span 
        v-if="text"
        :class="[
          'ms-2',
          textClass
        ]"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'LoadingSpinner',
  
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => [
        'primary', 'secondary', 'success',
        'danger', 'warning', 'info', 'light', 'dark'
      ].includes(value)
    },
    customSize: {
      type: Number,
      default: null
    },
    text: {
      type: String,
      default: ''
    },
    textClass: {
      type: String,
      default: ''
    },
    overlay: {
      type: Boolean,
      default: false
    },
    fade: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    const sizeClass = computed(() => {
      if (props.customSize) return ''
      return props.size === 'md' ? '' : `spinner-border-${props.size}`
    })

    const variantClass = computed(() => `text-${props.variant}`)
    const fadeClass = computed(() => props.fade ? 'fade-in' : '')

    const customStyle = computed(() => {
      if (!props.customSize) return {}
      return {
        width: `${props.customSize}px`,
        height: `${props.customSize}px`
      }
    })

    return {
      sizeClass,
      variantClass,
      fadeClass,
      customStyle
    }
  }
})
</script>

<style>
.loading-spinner-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.spinner-wrapper {
  opacity: 0;
}

.spinner-wrapper.fade-in {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Custom spinner sizes */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.spinner-border-lg {
  width: 3rem;
  height: 3rem;
}
</style>
