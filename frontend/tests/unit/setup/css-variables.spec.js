import { mount } from '@vue/test-utils'

describe('CSS Variables', () => {
  test('root CSS variables are defined', () => {
    const rootStyles = window.getComputedStyle(document.documentElement)
    
    // Colors
    expect(rootStyles.getPropertyValue('--primary-color')).toBeDefined()
    expect(rootStyles.getPropertyValue('--secondary-color')).toBeDefined()
    expect(rootStyles.getPropertyValue('--success-color')).toBeDefined()
    
    // Typography
    expect(rootStyles.getPropertyValue('--font-family-base')).toBeDefined()
    expect(rootStyles.getPropertyValue('--font-size-base')).toBeDefined()
    
    // Spacing
    expect(rootStyles.getPropertyValue('--spacing-base')).toBeDefined()
    expect(rootStyles.getPropertyValue('--spacing-lg')).toBeDefined()
    
    // Border radius
    expect(rootStyles.getPropertyValue('--border-radius')).toBeDefined()
  })

  test('CSS variables are applied correctly to elements', () => {
    const wrapper = mount({
      template: `
        <div class="test-component">
          <button class="btn-custom">Test Button</button>
          <div class="card-custom">Test Card</div>
        </div>
      `
    })
    
    const button = wrapper.find('.btn-custom')
    const card = wrapper.find('.card-custom')
    
    const buttonStyles = window.getComputedStyle(button.element)
    const cardStyles = window.getComputedStyle(card.element)
    
    expect(buttonStyles.borderRadius).toBe(getComputedStyle(document.documentElement)
      .getPropertyValue('--border-radius').trim())
    expect(cardStyles.borderRadius).toBe(getComputedStyle(document.documentElement)
      .getPropertyValue('--border-radius').trim())
  })
})