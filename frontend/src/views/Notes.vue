<template>
  <div class="container py-4">
    <h2>My Notes</h2>
    
    <div v-if="loading" data-test="loading-spinner">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" data-test="error-message">
      {{ error }}
    </div>

    <div class="row g-4">
      <div class="col-12">
        <NoteForm @submit-success="loadNotes" />
      </div>
      <div v-for="note in notes" :key="note.id" class="col-md-6 col-lg-4">
        <NoteCard 
          :note="note" 
          data-test="note-card"
          @note-updated="loadNotes"
          @note-deleted="loadNotes"
        />
      </div>
      <div v-if="notes.length === 0" class="col-12 text-center" data-test="empty-state">
        <p>No notes yet. Create your first note!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotes } from '@/services/notes'
import NoteCard from '@/components/NoteCard.vue'
import NoteForm from '@/components/NoteForm.vue'

export default {
  name: 'NotesView',
  components: {
    NoteCard,
    NoteForm
  },
  data() {
    return {
      notes: [],
      loading: false,
      error: null
    }
  },
  methods: {
    async loadNotes() {
      try {
        this.loading = true
        this.error = null
        this.notes = await getNotes()
      } catch (err) {
        this.error = 'Failed to load notes. Please try again.'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.loadNotes()
  }
}
</script>