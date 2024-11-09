import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Notes from '@/views/Notes.vue'

// Mock auth store first, before any imports might use it
jest.mock('@/stores/auth', () => ({
  state: {
    token: 'fake-token',
    user: {
      email: 'test@example.com',
      id: '123'
    }
  }
}))

// Mock notes service
jest.mock('@/services/notes', () => ({
  getNotes: jest.fn().mockResolvedValue([])
}))

describe('View Components', () => {
  let router

  beforeEach(() => {
    jest.clearAllMocks()
    
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/login', name: 'Login', component: Login },
        { path: '/register', name: 'Register', component: Register },
        { 
          path: '/notes', 
          name: 'Notes', 
          component: Notes,
          meta: { requiresAuth: true }
        }
      ]
    })
  })

  test('Notes component renders correctly', async () => {
    const wrapper = mount(Notes, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          NoteCard: true,
          NoteForm: true
        }
      }
    })
    
    await router.isReady()
    await wrapper.vm.$nextTick()
    
    // Check initial render
    expect(wrapper.find('h2').text()).toBe('My Notes')
    
    // Wait for loading to complete
    await new Promise(resolve => setTimeout(resolve, 0))
    
    // Verify empty state
    expect(wrapper.find('.spinner-border').exists()).toBe(false)
    expect(wrapper.find('p').text()).toBe('No notes yet. Create your first note!')
  })
})
