// Mock getComputedStyle
window.getComputedStyle = (element) => ({
  getPropertyValue: (prop) => {
    const values = {
      '--font-family-base': 'Avenir, Helvetica, Arial, sans-serif',
      '--dark-color': '#212529',
      '--spacing-base': '1rem',
      '--border-radius': '0.375rem',
      '--spacing-sm': '0.5rem',
      '--secondary-color': '#6c757d',
      '--primary-color': '#0d6efd',
      '--success-color': '#198754',
      '--font-size-base': '1rem',
      '--spacing-lg': '1.5rem'
    };
    return values[prop] || '';
  },
  ...{
    fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
    color: '#212529',
    borderRadius: '0.375rem',
    transition: 'all 0.3s ease',
    maxWidth: '1200px',
    padding: '1rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }
});