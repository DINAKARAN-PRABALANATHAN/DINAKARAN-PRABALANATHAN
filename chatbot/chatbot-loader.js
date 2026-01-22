/**
 * Chatbot Lazy Loader
 * 
 * Provides lazy loading functionality for chatbot resources.
 * Ensures chatbot loads after page DOMContentLoaded to avoid blocking initial render.
 * 
 * Requirements: 6.1, 6.5
 */

/**
 * ChatbotLoader - Handles lazy loading of chatbot resources
 */
const ChatbotLoader = {
  /**
   * Whether the chatbot has been initialized
   */
  _initialized: false,

  /**
   * Callback to execute when chatbot is ready
   */
  _onReadyCallback: null,

  /**
   * Stores the chatbot instance once initialized
   */
  _chatbotInstance: null,

  /**
   * Initializes the chatbot after DOM is ready
   * This ensures chatbot doesn't block initial page render
   * @param {Function} initCallback - Function that initializes and returns the chatbot
   * @returns {Promise} - Resolves when chatbot is initialized
   * Requirements: 6.1, 6.5
   */
  lazyLoad(initCallback) {
    return new Promise((resolve, reject) => {
      if (this._initialized) {
        resolve(this._chatbotInstance);
        return;
      }

      const initialize = () => {
        try {
          // Use requestIdleCallback if available for better performance
          // Falls back to setTimeout for browsers that don't support it
          const scheduleInit = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
          
          scheduleInit(() => {
            try {
              this._chatbotInstance = initCallback();
              this._initialized = true;
              
              if (this._onReadyCallback) {
                this._onReadyCallback(this._chatbotInstance);
              }
              
              resolve(this._chatbotInstance);
            } catch (error) {
              console.error('Failed to initialize chatbot:', error);
              reject(error);
            }
          }, { timeout: 2000 }); // Ensure initialization within 2 seconds
        } catch (error) {
          console.error('Failed to schedule chatbot initialization:', error);
          reject(error);
        }
      };

      // Check if DOM is already loaded
      if (document.readyState === 'loading') {
        // DOM not ready, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
      } else {
        // DOM already loaded, initialize immediately (but still async)
        initialize();
      }
    });
  },

  /**
   * Sets a callback to be executed when chatbot is ready
   * @param {Function} callback - Function to call with chatbot instance
   */
  onReady(callback) {
    if (this._initialized && this._chatbotInstance) {
      callback(this._chatbotInstance);
    } else {
      this._onReadyCallback = callback;
    }
  },

  /**
   * Checks if the chatbot has been initialized
   * @returns {boolean}
   */
  isInitialized() {
    return this._initialized;
  },

  /**
   * Gets the chatbot instance if initialized
   * @returns {Object|null}
   */
  getInstance() {
    return this._chatbotInstance;
  },

  /**
   * Resets the loader state (useful for testing)
   */
  reset() {
    this._initialized = false;
    this._onReadyCallback = null;
    this._chatbotInstance = null;
  }
};

// ES Module export
export { ChatbotLoader };

// CommonJS export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChatbotLoader };
}

// Browser global
if (typeof window !== 'undefined') {
  window.ChatbotLoader = ChatbotLoader;
}
