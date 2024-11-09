<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col">
        <h2 class="display-6 mb-0">My Notes</h2>
      </div>
    </div>
    
    <div v-if="loading" class="row" data-test="loading-spinner">
      <div class="col-md-6 col-lg-4 mb-4" v-for="n in 3" :key="n">
        <div class="card loading-card">
          <div class="card-body">
            <div class="loading-placeholder title-placeholder mb-3"></div>
            <div class="loading-placeholder content-placeholder mb-2"></div>
            <div class="loading-placeholder content-placeholder mb-2"></div>
            <div class="loading-placeholder content-placeholder w-75"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger fade show" role="alert" data-test="error-message">
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{{ error }}</div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <NoteForm @submit-success="loadNotes" />
          </div>
        </div>
      </div>
      
      <div v-for="note in notes" :key="note.id" class="col-md-6 col-lg-4">
        <NoteCard 
          :note="note" 
          data-test="note-card"
          @note-updated="loadNotes"
          @note-deleted="loadNotes"
          class="h-100"
        />
      </div>
      
      <div v-if="notes.length === 0 && !loading" class="col-12 text-center py-5" data-test="empty-state">
        <div class="empty-state">
          <i class="bi bi-journal-text display-1 mb-3 text-muted"></i>
          <p class="lead text-muted">No notes yet. Create your first note!</p>
        </div>
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

<style scoped>
.loading-card {
  height: 200px;
}

.loading-placeholder {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  height: 1rem;
}

.title-placeholder {
  height: 1.5rem;
  width: 70%;
}

.content-placeholder {
  height: 1rem;
  width: 100%;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state {
  padding: 3rem 1rem;
}

.empty-state i {
  opacity: 0.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: var(--spacing-sm);
    padding-right: var(--spacing-sm);
  }
}
</style>