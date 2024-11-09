// Mock window.getComputedStyle
window.getComputedStyle = (element) => ({
    getPropertyValue: (prop) => {
      return {
        '--primary-color': '#0d6efd',
        '--secondary-color': '#6c757d',
        '--spacing-base': '1rem',
        '--border-radius': '0.375rem'
      }[prop] || ''
    },
    padding: '1rem',
    margin: '1rem',
    marginBottom: '1rem',
    maxWidth: '1200px',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
    fontSize: '1rem'
  })