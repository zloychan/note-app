// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    }
  }
  
  // Mock Bootstrap
  jest.mock('bootstrap/dist/js/bootstrap.bundle.min.js', () => ({}))