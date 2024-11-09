import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import HomeView from '@/views/Home.vue'
import LoginView from '@/views/Login.vue'
import RegisterView from '@/views/Register.vue'
import NotesView from '@/views/Notes.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/notes',
    name: 'Notes',
    component: NotesView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

describe('App Component', () => {
  beforeEach(async () => {
    router.push('/')
    await router.isReady()
  })

  test('App contains navigation bar', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.find('nav').exists()).toBe(true)
  })
})
