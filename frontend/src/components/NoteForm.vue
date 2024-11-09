<template>
  <form @submit.prevent="handleSubmit" class="note-form">
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        v-model="form.title"
        :class="{ 'is-invalid': errors.title }"
        placeholder="Note Title"
      >
      <div class="invalid-feedback">{{ errors.title }}</div>
    </div>

    <div class="mb-3">
      <textarea
        class="form-control"
        v-model="form.content"
        :class="{ 'is-invalid': errors.content }"
        placeholder="Note Content"
        rows="4"
      ></textarea>
      <div class="invalid-feedback">{{ errors.content }}</div>
    </div>

    <div class="alert alert-danger" v-if="errors.general">
      {{ errors.general }}
    </div>

    <div class="d-flex justify-content-end gap-2">
      <button 
        type="button" 
        class="btn btn-secondary" 
        @click="resetForm"
      >
        Reset
      </button>
      <button 
        type="submit" 
        class="btn btn-primary" 
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : 'Save Note' }}
      </button>
    </div>
  </form>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import notesService from '@/services/notes'

export default {
  name: 'NoteForm',
  props: {
    note: {
      type: Object,
      default: null
    }
  },
  emits: ['submit-success', 'submit-error'],
  setup(props, { emit }) {
    const loading = ref(false)
    const isEditing = computed(() => !!props.note)

    const form = reactive({
      title: props.note?.title || '',
      content: props.note?.content || ''
    })

    const errors = reactive({
      title: '',
      content: '',
      general: ''
    })

    const validateForm = () => {
      let isValid = true
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '')

      // Title validation
      if (!form.title.trim()) {
        errors.title = 'Title is required'
        isValid = false
      } else if (form.title.length > 100) {
        errors.title = 'Title must be less than 100 characters'
        isValid = false
      }

      // Content validation
      if (!form.content.trim()) {
        errors.content = 'Content is required'
        isValid = false
      }

      return isValid
    }

    const resetForm = () => {
      form.title = props.note?.title || ''
      form.content = props.note?.content || ''
      Object.keys(errors).forEach(key => errors[key] = '')
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      errors.general = ''

      try {
        let response
        if (isEditing.value) {
          response = await notesService.updateNote(props.note.id, {
            title: form.title,
            content: form.content
          })
        } else {
          response = await notesService.createNote({
            title: form.title,
            content: form.content
          })
        }

        emit('submit-success', response.data)
        if (!isEditing.value) {
          form.title = ''
          form.content = ''
        }
      } catch (error) {
        console.error('Note submission error:', error)
        errors.general = error.message || 'An error occurred while saving the note'
        emit('submit-error', error)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      isEditing,
      handleSubmit,
      resetForm
    }
  }
}
</script>

<style scoped>
.note-form {
  max-width: 800px;
  margin: 0 auto;
}

textarea {
  resize: vertical;
  min-height: 120px;
}
</style>
