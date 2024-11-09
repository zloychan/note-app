import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { flushPromises } from '@vue/test-utils'
import Notes from '@/views/Notes.vue'
import { getNotes } from '@/services/notes'

// Mock the notes service
jest.mock('@/services/notes', () => ({
  getNotes: jest.fn()
}))

describe('Notes.vue', () => {
  let router
  let wrapper

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/notes', component: Notes }]
    })
    
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  const mountComponent = () => {
    wrapper = mount(Notes, {
      global: {
        plugins: [router],
        stubs: {
          NoteCard: true,
          NoteForm: true
        }
      }
    })
  }

  test('displays loading state initially', async () => {
    getNotes.mockImplementation(() => new Promise(() => {})) // Never resolves
    mountComponent()
    
    await router.isReady()
    
    expect(wrapper.find('[data-test="loading-spinner"]').exists()).toBe(true)
  })

  test('displays notes when loaded successfully', async () => {
    const mockNotes = [
      { id: 1, title: 'Note 1', content: 'Content 1' },
      { id: 2, title: 'Note 2', content: 'Content 2' }
    ]
    getNotes.mockResolvedValueOnce(mockNotes)

    mountComponent()
    await router.isReady()
    await flushPromises()

    expect(wrapper.findAll('[data-test="note-card"]')).toHaveLength(2)
  })

  test('displays error message when loading fails', async () => {
    getNotes.mockRejectedValueOnce(new Error('Failed to load notes'))

    mountComponent()
    await router.isReady()
    await flushPromises()

    expect(wrapper.find('[data-test="error-message"]').text())
      .toContain('Failed to load notes')
  })

  test('displays empty state message when no notes exist', async () => {
    getNotes.mockResolvedValueOnce([])

    mountComponent()
    await router.isReady()
    await flushPromises()

    expect(wrapper.find('[data-test="empty-state"]').text())
      .toContain('No notes yet')
  })
})