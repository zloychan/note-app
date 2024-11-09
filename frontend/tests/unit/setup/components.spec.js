import { mount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Notes from '@/views/Notes.vue'

describe('View Components', () => {
  test('Home component renders correctly', () => {
    const wrapper = mount(Home)
    expect(wrapper.find('h1').text()).toBe('Welcome to Notes App')
  })

  test('Login component renders correctly', () => {
    const wrapper = mount(Login)
    expect(wrapper.find('h2').text()).toBe('Login')
  })

  test('Register component renders correctly', () => {
    const wrapper = mount(Register)
    expect(wrapper.find('h2').text()).toBe('Register')
  })

  test('Notes component renders correctly', () => {
    const wrapper = mount(Notes)
    expect(wrapper.find('h2').text()).toBe('My Notes')
  })
})
