import '@testing-library/jest-dom';

// jest.setup.js
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }

    observe() {
      // Simulate intersection
      this.callback([{ isIntersecting: true }]);
    }

    unobserve() {
      // Optional: clean up logic
    }

    disconnect() {
      // Optional: clean up logic
    }
  };
