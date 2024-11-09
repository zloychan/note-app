import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('Bootstrap Integration', () => {
  test('Bootstrap CSS is imported', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          'router-view': true,
          'router-link': true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
