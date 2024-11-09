<template>
  <div class="card note-card mb-3" :class="{ 'is-loading': loading }">
    <div class="card-body">
      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ error }}
        <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
      </div>

      <!-- View Mode -->
      <div v-if="!isEditing" class="note-content">
        <h5 class="card-title">{{ note.title }}</h5>
        <p class="card-text">{{ note.content }}</p>
        <div class="text-muted small mb-2">
          Last updated: {{ formatDate(note.updated_at) }}
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-sm btn-outline-primary me-2" @click="startEdit">
            Edit
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>

      <!-- Edit Mode -->
      <form v-else @submit.prevent="handleSave">
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="editedNote.title"
            :class="{ 'is-invalid': validationErrors.title }"
            placeholder="Note Title"
          >
          <div class="invalid-feedback">{{ validationErrors.title }}</div>
        </div>
        <div class="mb-3">
          <textarea
            class="form-control"
            v-model="editedNote.content"
            :class="{ 'is-invalid': validationErrors.content }"
            rows="3"
            placeholder="Note Content"
          ></textarea>
          <div class="invalid-feedback">{{ validationErrors.content }}</div>
        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="cancelEdit">
            Cancel
          </button>
          <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import notesService from '@/services/notes'

export default {
  name: 'NoteCard',
  props: {
    note: {
      type: Object,
      required: true
    }
  },

  setup(props, { emit }) {
    const loading = ref(false)
    const error = ref('')
    const isEditing = ref(false)
    const editedNote = reactive({
      title: '',
      content: ''
    })
    const validationErrors = reactive({
      title: '',
      content: ''
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const startEdit = () => {
      editedNote.title = props.note.title
      editedNote.content = props.note.content
      isEditing.value = true
    }

    const cancelEdit = () => {
      isEditing.value = false
      validationErrors.title = ''
      validationErrors.content = ''
    }

    const validateForm = () => {
      let isValid = true
      validationErrors.title = ''
      validationErrors.content = ''

      if (!editedNote.title.trim()) {
        validationErrors.title = 'Title is required'
        isValid = false
      }
      if (!editedNote.content.trim()) {
        validationErrors.content = 'Content is required'
        isValid = false
      }

      return isValid
    }

    const handleSave = async () => {
      if (!validateForm()) return

      loading.value = true
      error.value = ''

      try {
        const updatedNote = await notesService.updateNote(props.note.id, {
          title: editedNote.title,
          content: editedNote.content
        })
        emit('update', updatedNote)
        isEditing.value = false
      } catch (err) {
        error.value = 'Failed to update note. Please try again.'
        console.error('Update error:', err)
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = async () => {
      if (!window.confirm('Are you sure you want to delete this note?')) return

      loading.value = true
      error.value = ''

      try {
        await notesService.deleteNote(props.note.id)
        emit('delete', props.note.id)
      } catch (err) {
        error.value = 'Failed to delete note. Please try again.'
        console.error('Delete error:', err)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      error,
      isEditing,
      editedNote,
      validationErrors,
      formatDate,
      startEdit,
      cancelEdit,
      handleSave,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.note-card {
  transition: all 0.3s ease;
}

.note-card.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

.note-content {
  animation: fadeIn 0.3s ease;
}

form {
  animation: slideIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-text {
  white-space: pre-wrap;
}

textarea {
  resize: vertical;
}
</style>
