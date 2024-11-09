import { mount } from '@vue/test-utils'

describe('Custom Style Classes', () => {
  test('btn-custom class has correct styles', () => {
    const wrapper = mount({
      template: '<button class="btn-custom">Test Button</button>'
    })
    
    const button = wrapper.find('.btn-custom')
    const computedStyles = window.getComputedStyle(button.element)
    
    expect(computedStyles.borderRadius).toBeDefined()
    expect(computedStyles.transition).toContain('0.3s')
  })

  test('card-custom class has correct styles', () => {
    const wrapper = mount({
      template: '<div class="card-custom">Test Card</div>'
    })
    
    const card = wrapper.find('.card-custom')
    const computedStyles = window.getComputedStyle(card.element)
    
    expect(computedStyles.borderRadius).toBeDefined()
    expect(computedStyles.boxShadow).toBeDefined()
  })

  test('form-control-custom class has correct styles', () => {
    const wrapper = mount({
      template: '<input class="form-control-custom" />'
    })
    
    const input = wrapper.find('.form-control-custom')
    const computedStyles = window.getComputedStyle(input.element)
    
    expect(computedStyles.borderRadius).toBeDefined()
    expect(computedStyles.padding).toBeDefined()
  })
})