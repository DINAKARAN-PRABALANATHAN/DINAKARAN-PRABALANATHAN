/**
 * ChatWidget Class
 * 
 * A floating chat widget UI component that provides an interactive chat interface
 * for the portfolio chatbot. Handles user interactions, message display, and
 * widget state management.
 * 
 * Requirements: 1.1, 1.2, 1.3, 2.7, 3.1, 3.2, 3.3, 3.4, 6.2
 */

class ChatWidget {
  /**
   * Default debounce delay for user input in milliseconds
   * @static
   */
  static DEFAULT_DEBOUNCE_DELAY = 300;

  /**
   * Maximum allowed query length in characters
   * @static
   */
  static MAX_QUERY_LENGTH = 500;

  /**
   * Fallback contact email for error recovery
   * @static
   */
  static FALLBACK_CONTACT_EMAIL = 'dinakaranprabalanathan@gmail.com';

  /**
   * User-friendly error messages
   * @static
   */
  static ERROR_MESSAGES = {
    EMPTY_QUERY: 'Please enter a question or message.',
    QUERY_TOO_LONG: 'Your message is too long. Please keep it under 500 characters.',
    INITIALIZATION_FAILED: 'Chat is temporarily unavailable. Please contact me directly.',
    GENERAL_ERROR: 'Something went wrong. Please try again or contact me directly.'
  };

  /**
   * Check if development mode is enabled
   * @private
   * @returns {boolean} - True if in development mode
   */
  static _isDevelopmentMode() {
    // Check for common development indicators
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      return true;
    }
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('.local');
    }
    return false;
  }

  /**
   * Logs errors in development mode only
   * @private
   * @param {string} message - Error message
   * @param {Error} [error] - Optional error object
   */
  static _logError(message, error = null) {
    if (ChatWidget._isDevelopmentMode()) {
      console.error(`[ChatWidget] ${message}`, error || '');
    }
  }

  /**
   * Validates user query input
   * @static
   * @param {string} query - The query to validate
   * @returns {Object} - Validation result with isValid and error properties
   */
  static validateQuery(query) {
    // Check for empty or whitespace-only queries
    if (!query || query.trim().length === 0) {
      return {
        isValid: false,
        error: ChatWidget.ERROR_MESSAGES.EMPTY_QUERY
      };
    }

    // Check for maximum length
    if (query.length > ChatWidget.MAX_QUERY_LENGTH) {
      return {
        isValid: false,
        error: ChatWidget.ERROR_MESSAGES.QUERY_TOO_LONG
      };
    }

    return { isValid: true };
  }

  /**
   * Initializes the ChatWidget with configuration options
   * @param {Object} config - Configuration object
   * @param {string} [config.primaryColor='#6366f1'] - Primary accent color
   * @param {string} [config.theme='dark'] - Theme ('dark' or 'light')
   * @param {string} [config.position='bottom-right'] - Widget position
   * @param {number} [config.debounceDelay=300] - Debounce delay for input in ms
   */
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      primaryColor: config.primaryColor || '#6366f1',
      theme: config.theme || 'dark',
      position: config.position || 'bottom-right',
      debounceDelay: config.debounceDelay || ChatWidget.DEFAULT_DEBOUNCE_DELAY
    };

    // Widget state
    this.state = {
      isOpen: false,
      isTyping: false,
      messageCount: 0,
      hasUnread: false
    };

    // DOM element references (will be set during render)
    this.elements = {
      container: null,
      floatingButton: null,
      chatInterface: null,
      messagesContainer: null,
      inputField: null,
      sendButton: null,
      closeButton: null,
      typingIndicator: null,
      header: null
    };

    // Event callbacks
    this.onMessageSubmit = null;
    this.onOpen = null;
    this.onClose = null;

    // Bind methods to preserve context
    this._handleFloatingButtonClick = this._handleFloatingButtonClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleSendButtonClick = this._handleSendButtonClick.bind(this);
    this._handleInputKeypress = this._handleInputKeypress.bind(this);
    
    // Touch event handlers
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._handleMessagesTouchStart = this._handleMessagesTouchStart.bind(this);
    this._handleMessagesTouchMove = this._handleMessagesTouchMove.bind(this);
    this._handleMessagesTouchEnd = this._handleMessagesTouchEnd.bind(this);
    
    // Debounce state for rapid input handling
    this._debounceState = {
      timerId: null,
      lastSubmitTime: 0,
      isProcessing: false
    };
    
    // Touch state tracking
    this._touchState = {
      startX: 0,
      startY: 0,
      startTime: 0,
      isSwiping: false,
      swipeThreshold: 50,  // Minimum distance for swipe detection
      tapThreshold: 10,    // Maximum movement for tap detection
      swipeTimeThreshold: 300  // Maximum time for swipe gesture (ms)
    };
  }

  /**
   * Creates the HTML structure for the widget
   * @private
   * @returns {HTMLElement} - The widget container element
   */
  _createWidgetHTML() {
    // Create main container
    const container = document.createElement('div');
    container.className = `chatbot-widget chatbot-widget--${this.config.theme} chatbot-widget--${this.config.position}`;
    container.setAttribute('data-chatbot-widget', 'true');

    // Create floating button
    const floatingButton = document.createElement('button');
    floatingButton.className = 'chatbot-floating-btn';
    floatingButton.setAttribute('aria-label', 'Open chat');
    floatingButton.setAttribute('type', 'button');
    floatingButton.innerHTML = `
      <svg class="chatbot-icon chatbot-icon--chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg class="chatbot-icon chatbot-icon--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span class="chatbot-unread-badge" style="display: none;">0</span>
    `;

    // Create chat interface
    const chatInterface = document.createElement('div');
    chatInterface.className = 'chatbot-interface';
    chatInterface.setAttribute('aria-hidden', 'true');
    chatInterface.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <div class="chatbot-header-text">
            <h3 class="chatbot-title">Portfolio Assistant</h3>
            <span class="chatbot-status">Online</span>
          </div>
        </div>
        <button class="chatbot-close-btn" aria-label="Close chat" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="chatbot-messages" role="log" aria-live="polite">
        <div class="chatbot-typing-indicator" style="display: none;">
          <div class="chatbot-typing-dot"></div>
          <div class="chatbot-typing-dot"></div>
          <div class="chatbot-typing-dot"></div>
        </div>
      </div>
      <div class="chatbot-input-area">
        <div class="chatbot-suggestions"></div>
        <div class="chatbot-input-container">
          <input 
            type="text" 
            class="chatbot-input" 
            placeholder="Type your message..." 
            aria-label="Type your message"
            maxlength="500"
          />
          <button class="chatbot-send-btn" aria-label="Send message" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    container.appendChild(floatingButton);
    container.appendChild(chatInterface);

    return container;
  }

  /**
   * Renders the widget and injects it into the DOM
   * Includes error recovery with fallback contact link
   * @param {HTMLElement} [parentElement=document.body] - Parent element to inject into
   * @returns {boolean} - True if rendering succeeded, false if fallback was used
   */
  render(parentElement = document.body) {
    try {
      // Check if widget already exists
      if (this.elements.container) {
        ChatWidget._logError('ChatWidget is already rendered');
        return true;
      }

      // Create widget HTML
      const container = this._createWidgetHTML();

      // Store element references
      this.elements.container = container;
      this.elements.floatingButton = container.querySelector('.chatbot-floating-btn');
      this.elements.chatInterface = container.querySelector('.chatbot-interface');
      this.elements.messagesContainer = container.querySelector('.chatbot-messages');
      this.elements.inputField = container.querySelector('.chatbot-input');
      this.elements.sendButton = container.querySelector('.chatbot-send-btn');
      this.elements.closeButton = container.querySelector('.chatbot-close-btn');
      this.elements.typingIndicator = container.querySelector('.chatbot-typing-indicator');
      this.elements.header = container.querySelector('.chatbot-header');
      this.elements.suggestionsContainer = container.querySelector('.chatbot-suggestions');
      this.elements.unreadBadge = container.querySelector('.chatbot-unread-badge');

      // Verify critical elements were created
      if (!this.elements.floatingButton || !this.elements.chatInterface || !this.elements.messagesContainer) {
        throw new Error('Failed to create critical widget elements');
      }

      // Apply custom primary color via CSS custom property
      container.style.setProperty('--chatbot-primary-color', this.config.primaryColor);

      // Attach event listeners
      this._attachEventListeners();

      // Inject into DOM
      parentElement.appendChild(container);
      
      return true;
    } catch (error) {
      ChatWidget._logError('Failed to initialize chat widget:', error);
      
      // Fallback: show simple contact link
      this._renderFallbackContactLink(parentElement);
      
      return false;
    }
  }

  /**
   * Renders a fallback contact link when widget initialization fails
   * @private
   * @param {HTMLElement} parentElement - Parent element to inject into
   */
  _renderFallbackContactLink(parentElement) {
    try {
      const fallbackButton = document.createElement('a');
      fallbackButton.href = `mailto:${ChatWidget.FALLBACK_CONTACT_EMAIL}`;
      fallbackButton.className = 'chatbot-fallback-button';
      fallbackButton.setAttribute('aria-label', 'Contact via email');
      fallbackButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <span class="chatbot-fallback-text">Contact Me</span>
      `;
      
      // Apply basic styling inline for fallback
      fallbackButton.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background-color: ${this.config.primaryColor};
        color: white;
        text-decoration: none;
        border-radius: 50px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transition: transform 0.2s, box-shadow 0.2s;
      `;
      
      // Add hover effect
      fallbackButton.addEventListener('mouseenter', () => {
        fallbackButton.style.transform = 'scale(1.05)';
        fallbackButton.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
      });
      fallbackButton.addEventListener('mouseleave', () => {
        fallbackButton.style.transform = 'scale(1)';
        fallbackButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      });
      
      parentElement.appendChild(fallbackButton);
      
      // Store reference for potential cleanup
      this._fallbackElement = fallbackButton;
    } catch (fallbackError) {
      ChatWidget._logError('Failed to render fallback contact link:', fallbackError);
    }
  }

  /**
   * Attaches event listeners to widget elements
   * @private
   */
  _attachEventListeners() {
    // Floating button click
    this.elements.floatingButton.addEventListener('click', this._handleFloatingButtonClick);

    // Close button click
    this.elements.closeButton.addEventListener('click', this._handleCloseButtonClick);

    // Send button click
    this.elements.sendButton.addEventListener('click', this._handleSendButtonClick);

    // Input field keypress (Enter to send)
    this.elements.inputField.addEventListener('keypress', this._handleInputKeypress);

    // Input field focus handling for mobile keyboard
    this.elements.inputField.addEventListener('focus', () => {
      // Scroll to bottom when input is focused (helps with mobile keyboard)
      setTimeout(() => this.scrollToBottom(), 100);
    });

    // Attach touch event listeners for mobile support
    this._attachTouchEventListeners();
  }

  /**
   * Attaches touch event listeners for mobile support
   * @private
   */
  _attachTouchEventListeners() {
    // Touch events for floating button (tap to open/close)
    this.elements.floatingButton.addEventListener('touchstart', this._handleTouchStart, { passive: true });
    this.elements.floatingButton.addEventListener('touchend', this._handleTouchEnd, { passive: false });
    
    // Touch events for close button
    this.elements.closeButton.addEventListener('touchstart', this._handleTouchStart, { passive: true });
    this.elements.closeButton.addEventListener('touchend', this._handleTouchEnd, { passive: false });
    
    // Touch events for send button
    this.elements.sendButton.addEventListener('touchstart', this._handleTouchStart, { passive: true });
    this.elements.sendButton.addEventListener('touchend', this._handleTouchEnd, { passive: false });
    
    // Touch events for messages container (swipe to scroll, swipe down to close)
    this.elements.messagesContainer.addEventListener('touchstart', this._handleMessagesTouchStart, { passive: true });
    this.elements.messagesContainer.addEventListener('touchmove', this._handleMessagesTouchMove, { passive: true });
    this.elements.messagesContainer.addEventListener('touchend', this._handleMessagesTouchEnd, { passive: false });
    
    // Touch events for chat interface header (swipe down to close)
    this.elements.header.addEventListener('touchstart', this._handleTouchStart, { passive: true });
    this.elements.header.addEventListener('touchmove', this._handleTouchMove, { passive: true });
    this.elements.header.addEventListener('touchend', this._handleTouchEnd, { passive: false });
    
    // Add touch feedback classes to interactive elements
    this._addTouchFeedback(this.elements.floatingButton);
    this._addTouchFeedback(this.elements.closeButton);
    this._addTouchFeedback(this.elements.sendButton);
  }

  /**
   * Adds touch feedback (active state) to an element
   * @private
   * @param {HTMLElement} element - Element to add touch feedback to
   */
  _addTouchFeedback(element) {
    if (!element) return;
    
    element.addEventListener('touchstart', () => {
      element.classList.add('chatbot-touch-active');
    }, { passive: true });
    
    element.addEventListener('touchend', () => {
      element.classList.remove('chatbot-touch-active');
    }, { passive: true });
    
    element.addEventListener('touchcancel', () => {
      element.classList.remove('chatbot-touch-active');
    }, { passive: true });
  }

  /**
   * Handles touch start event for buttons
   * @private
   * @param {TouchEvent} event
   */
  _handleTouchStart(event) {
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    this._touchState.startX = touch.clientX;
    this._touchState.startY = touch.clientY;
    this._touchState.startTime = Date.now();
    this._touchState.isSwiping = false;
  }

  /**
   * Handles touch move event
   * @private
   * @param {TouchEvent} event
   */
  _handleTouchMove(event) {
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - this._touchState.startX;
    const deltaY = touch.clientY - this._touchState.startY;
    
    // Check if this is a swipe gesture
    if (Math.abs(deltaX) > this._touchState.tapThreshold || 
        Math.abs(deltaY) > this._touchState.tapThreshold) {
      this._touchState.isSwiping = true;
    }
  }

  /**
   * Handles touch end event for buttons
   * @private
   * @param {TouchEvent} event
   */
  _handleTouchEnd(event) {
    const touchDuration = Date.now() - this._touchState.startTime;
    const target = event.currentTarget;
    
    // If it was a quick tap (not a swipe), handle as click
    if (!this._touchState.isSwiping && touchDuration < this._touchState.swipeTimeThreshold) {
      // Prevent default to avoid double-firing with click event
      event.preventDefault();
      
      // Handle tap based on target element
      if (target === this.elements.floatingButton) {
        this._handleFloatingButtonClick();
      } else if (target === this.elements.closeButton) {
        this._handleCloseButtonClick();
      } else if (target === this.elements.sendButton) {
        this._handleSendButtonClick();
      }
    }
    
    // Check for swipe down on header to close
    if (target === this.elements.header && this._touchState.isSwiping) {
      const deltaY = event.changedTouches[0].clientY - this._touchState.startY;
      if (deltaY > this._touchState.swipeThreshold && this.state.isOpen) {
        this.close();
      }
    }
    
    // Reset touch state
    this._touchState.isSwiping = false;
  }

  /**
   * Handles touch start on messages container
   * @private
   * @param {TouchEvent} event
   */
  _handleMessagesTouchStart(event) {
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    this._touchState.startX = touch.clientX;
    this._touchState.startY = touch.clientY;
    this._touchState.startTime = Date.now();
    this._touchState.isSwiping = false;
    this._touchState.scrollTop = this.elements.messagesContainer.scrollTop;
  }

  /**
   * Handles touch move on messages container
   * @private
   * @param {TouchEvent} event
   */
  _handleMessagesTouchMove(event) {
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    const deltaY = touch.clientY - this._touchState.startY;
    
    // Mark as swiping if moved beyond threshold
    if (Math.abs(deltaY) > this._touchState.tapThreshold) {
      this._touchState.isSwiping = true;
    }
  }

  /**
   * Handles touch end on messages container
   * @private
   * @param {TouchEvent} event
   */
  _handleMessagesTouchEnd(event) {
    // Check for swipe down at top of messages to close widget
    if (this._touchState.isSwiping && this.state.isOpen) {
      const deltaY = event.changedTouches[0].clientY - this._touchState.startY;
      const wasAtTop = this._touchState.scrollTop <= 0;
      
      // If at top of messages and swiped down significantly, close the widget
      if (wasAtTop && deltaY > this._touchState.swipeThreshold * 2) {
        this.close();
      }
    }
    
    // Reset touch state
    this._touchState.isSwiping = false;
  }

  /**
   * Handles floating button click
   * @private
   */
  _handleFloatingButtonClick() {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Handles close button click
   * @private
   */
  _handleCloseButtonClick() {
    this.close();
  }

  /**
   * Handles send button click
   * @private
   */
  _handleSendButtonClick() {
    this._submitMessage();
  }

  /**
   * Handles input field keypress
   * @private
   * @param {KeyboardEvent} event
   */
  _handleInputKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this._submitMessage();
    }
  }

  /**
   * Submits the current message from the input field
   * Includes debouncing to prevent excessive processing during rapid typing
   * Includes input validation for empty queries and max length
   * @private
   * Requirements: 2.7, 6.2
   */
  _submitMessage() {
    const message = this.elements.inputField.value;
    
    // Validate input
    const validation = ChatWidget.validateQuery(message);
    if (!validation.isValid) {
      // Display error message to user
      this._displayErrorMessage(validation.error);
      return;
    }

    const trimmedMessage = message.trim();

    // Debounce check: prevent rapid submissions
    const now = Date.now();
    const timeSinceLastSubmit = now - this._debounceState.lastSubmitTime;
    
    if (timeSinceLastSubmit < this.config.debounceDelay && this._debounceState.isProcessing) {
      // Too soon since last submission and still processing, ignore
      return;
    }

    // Clear any pending debounce timer
    if (this._debounceState.timerId) {
      clearTimeout(this._debounceState.timerId);
      this._debounceState.timerId = null;
    }

    // Update debounce state
    this._debounceState.lastSubmitTime = now;
    this._debounceState.isProcessing = true;

    // Clear input field
    this.elements.inputField.value = '';

    // Clear suggestions
    this._clearSuggestions();

    // Trigger callback if set
    if (typeof this.onMessageSubmit === 'function') {
      // Wrap callback to track processing completion
      const originalCallback = this.onMessageSubmit;
      const self = this;
      
      try {
        // Call the callback
        const result = originalCallback(trimmedMessage);
        
        // If callback returns a promise, wait for it
        if (result && typeof result.then === 'function') {
          result
            .catch((error) => {
              ChatWidget._logError('Error in message submit callback:', error);
              self._displayErrorMessage(ChatWidget.ERROR_MESSAGES.GENERAL_ERROR);
            })
            .finally(() => {
              self._debounceState.isProcessing = false;
            });
        } else {
          // For synchronous callbacks, mark as done after a short delay
          setTimeout(() => {
            self._debounceState.isProcessing = false;
          }, 100);
        }
      } catch (error) {
        ChatWidget._logError('Error in message submit callback:', error);
        this._displayErrorMessage(ChatWidget.ERROR_MESSAGES.GENERAL_ERROR);
        this._debounceState.isProcessing = false;
      }
    } else {
      this._debounceState.isProcessing = false;
    }
  }

  /**
   * Displays an error message in the chat interface
   * @private
   * @param {string} errorMessage - The error message to display
   */
  _displayErrorMessage(errorMessage) {
    // Create a temporary error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'chatbot-message chatbot-message--error';
    
    const bubbleElement = document.createElement('div');
    bubbleElement.className = 'chatbot-message-bubble chatbot-message-bubble--error';
    bubbleElement.textContent = errorMessage;
    
    errorElement.appendChild(bubbleElement);

    // Insert error message before typing indicator
    this.elements.messagesContainer.insertBefore(
      errorElement, 
      this.elements.typingIndicator
    );

    // Scroll to show the error
    this.scrollToBottom();

    // Auto-remove error message after 5 seconds
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.parentNode.removeChild(errorElement);
      }
    }, 5000);
  }

  /**
   * Submits a message with debouncing
   * Use this for programmatic message submission with debounce protection
   * @param {string} message - The message to submit
   * @param {number} [delay] - Optional custom debounce delay
   * Requirements: 6.2
   */
  submitMessageDebounced(message, delay = null) {
    const debounceDelay = delay || this.config.debounceDelay;
    
    // Clear any existing debounce timer
    if (this._debounceState.timerId) {
      clearTimeout(this._debounceState.timerId);
    }
    
    // Set up debounced submission
    this._debounceState.timerId = setTimeout(() => {
      this.elements.inputField.value = message;
      this._submitMessage();
      this._debounceState.timerId = null;
    }, debounceDelay);
  }

  /**
   * Cancels any pending debounced submission
   */
  cancelDebouncedSubmit() {
    if (this._debounceState.timerId) {
      clearTimeout(this._debounceState.timerId);
      this._debounceState.timerId = null;
    }
  }

  /**
   * Checks if a submission is currently being processed
   * @returns {boolean} - True if processing
   */
  isProcessing() {
    return this._debounceState.isProcessing;
  }

  /**
   * Opens the chat interface
   */
  open() {
    if (this.state.isOpen) {
      return;
    }

    this.state.isOpen = true;
    this.state.hasUnread = false;

    // Update UI
    this.elements.container.classList.add('chatbot-widget--open');
    this.elements.chatInterface.setAttribute('aria-hidden', 'false');
    this.elements.floatingButton.setAttribute('aria-expanded', 'true');
    this._updateUnreadBadge();

    // Focus input field
    setTimeout(() => {
      this.elements.inputField.focus();
      this.scrollToBottom();
    }, 300); // Wait for animation

    // Trigger callback
    if (typeof this.onOpen === 'function') {
      this.onOpen();
    }
  }

  /**
   * Closes the chat interface
   */
  close() {
    if (!this.state.isOpen) {
      return;
    }

    this.state.isOpen = false;

    // Update UI
    this.elements.container.classList.remove('chatbot-widget--open');
    this.elements.chatInterface.setAttribute('aria-hidden', 'true');
    this.elements.floatingButton.setAttribute('aria-expanded', 'false');

    // Trigger callback
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  /**
   * Adds a message to the chat display
   * @param {string} message - The message content
   * @param {string} sender - The sender ('user' or 'bot')
   * @param {Object} [options] - Additional options
   * @param {string[]} [options.suggestions] - Follow-up suggestions (for bot messages)
   * @returns {HTMLElement} - The created message element
   */
  addMessage(message, sender, options = {}) {
    // Validate sender
    if (!['user', 'bot'].includes(sender)) {
      console.error('Invalid sender. Must be "user" or "bot"');
      return null;
    }

    // Hide typing indicator if showing
    if (sender === 'bot') {
      this.hideTypingIndicator();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message chatbot-message--${sender}`;
    
    // Create message bubble
    const bubbleElement = document.createElement('div');
    bubbleElement.className = 'chatbot-message-bubble';
    
    // Process message content (support basic markdown-like formatting)
    bubbleElement.innerHTML = this._formatMessage(message);
    
    messageElement.appendChild(bubbleElement);

    // Add timestamp
    const timestampElement = document.createElement('span');
    timestampElement.className = 'chatbot-message-time';
    timestampElement.textContent = this._formatTime(new Date());
    messageElement.appendChild(timestampElement);

    // Insert message before typing indicator
    this.elements.messagesContainer.insertBefore(
      messageElement, 
      this.elements.typingIndicator
    );

    // Update state
    this.state.messageCount++;

    // Handle unread messages when widget is closed
    if (!this.state.isOpen && sender === 'bot') {
      this.state.hasUnread = true;
      this._updateUnreadBadge();
    }

    // Show suggestions if provided (for bot messages)
    if (sender === 'bot' && options.suggestions && options.suggestions.length > 0) {
      this._showSuggestions(options.suggestions);
    }

    // Scroll to bottom
    this.scrollToBottom();

    return messageElement;
  }

  /**
   * Formats message content with basic markdown support
   * @private
   * @param {string} message - Raw message content
   * @returns {string} - Formatted HTML
   */
  _formatMessage(message) {
    if (!message) return '';
    
    // Escape HTML first
    let formatted = this._escapeHtml(message);
    
    // Bold: **text** or __text__
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic: *text* or _text_
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Bullet points: • or -
    formatted = formatted.replace(/^[•\-]\s+(.*)$/gm, '<span class="chatbot-bullet">$1</span>');
    
    // Links (basic URL detection)
    formatted = formatted.replace(
      /(https?:\/\/[^\s<]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    // Email links
    formatted = formatted.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1">$1</a>'
    );
    
    return formatted;
  }

  /**
   * Escapes HTML special characters
   * @private
   * @param {string} text - Text to escape
   * @returns {string} - Escaped text
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Formats a timestamp for display
   * @private
   * @param {Date} date - Date to format
   * @returns {string} - Formatted time string
   */
  _formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Shows the typing indicator
   */
  showTypingIndicator() {
    if (this.state.isTyping) {
      return;
    }

    this.state.isTyping = true;
    this.elements.typingIndicator.style.display = 'flex';
    this.scrollToBottom();
  }

  /**
   * Hides the typing indicator
   */
  hideTypingIndicator() {
    if (!this.state.isTyping) {
      return;
    }

    this.state.isTyping = false;
    this.elements.typingIndicator.style.display = 'none';
  }

  /**
   * Scrolls the message container to the bottom
   */
  scrollToBottom() {
    if (this.elements.messagesContainer) {
      this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
    }
  }

  /**
   * Shows suggestion buttons
   * @private
   * @param {string[]} suggestions - Array of suggestion strings
   */
  _showSuggestions(suggestions) {
    this._clearSuggestions();

    if (!suggestions || suggestions.length === 0) {
      return;
    }

    suggestions.forEach(suggestion => {
      const button = document.createElement('button');
      button.className = 'chatbot-suggestion-btn';
      button.textContent = suggestion;
      button.type = 'button';
      button.addEventListener('click', () => {
        this.elements.inputField.value = suggestion;
        this._submitMessage();
      });
      this.elements.suggestionsContainer.appendChild(button);
    });
  }

  /**
   * Clears all suggestion buttons
   * @private
   */
  _clearSuggestions() {
    if (this.elements.suggestionsContainer) {
      this.elements.suggestionsContainer.innerHTML = '';
    }
  }

  /**
   * Updates the unread badge display
   * @private
   */
  _updateUnreadBadge() {
    if (!this.elements.unreadBadge) return;

    if (this.state.hasUnread && !this.state.isOpen) {
      this.elements.unreadBadge.style.display = 'flex';
      this.elements.unreadBadge.textContent = '!';
    } else {
      this.elements.unreadBadge.style.display = 'none';
    }
  }

  /**
   * Gets the current widget state
   * @returns {Object} - Current state object
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Gets all messages currently displayed
   * @returns {Array} - Array of message objects
   */
  getMessages() {
    const messageElements = this.elements.messagesContainer.querySelectorAll('.chatbot-message');
    return Array.from(messageElements).map(el => ({
      content: el.querySelector('.chatbot-message-bubble').textContent,
      sender: el.classList.contains('chatbot-message--user') ? 'user' : 'bot'
    }));
  }

  /**
   * Clears all messages from the display
   */
  clearMessages() {
    const messages = this.elements.messagesContainer.querySelectorAll('.chatbot-message');
    messages.forEach(msg => msg.remove());
    this.state.messageCount = 0;
    this._clearSuggestions();
  }

  /**
   * Sets the message submit callback
   * @param {Function} callback - Function to call when message is submitted
   */
  setOnMessageSubmit(callback) {
    this.onMessageSubmit = callback;
  }

  /**
   * Sets the open callback
   * @param {Function} callback - Function to call when widget opens
   */
  setOnOpen(callback) {
    this.onOpen = callback;
  }

  /**
   * Sets the close callback
   * @param {Function} callback - Function to call when widget closes
   */
  setOnClose(callback) {
    this.onClose = callback;
  }

  /**
   * Destroys the widget and removes it from DOM
   */
  destroy() {
    // Cancel any pending debounced submissions
    this.cancelDebouncedSubmit();
    
    // Remove event listeners
    if (this.elements.floatingButton) {
      this.elements.floatingButton.removeEventListener('click', this._handleFloatingButtonClick);
      this.elements.floatingButton.removeEventListener('touchstart', this._handleTouchStart);
      this.elements.floatingButton.removeEventListener('touchend', this._handleTouchEnd);
    }
    if (this.elements.closeButton) {
      this.elements.closeButton.removeEventListener('click', this._handleCloseButtonClick);
      this.elements.closeButton.removeEventListener('touchstart', this._handleTouchStart);
      this.elements.closeButton.removeEventListener('touchend', this._handleTouchEnd);
    }
    if (this.elements.sendButton) {
      this.elements.sendButton.removeEventListener('click', this._handleSendButtonClick);
      this.elements.sendButton.removeEventListener('touchstart', this._handleTouchStart);
      this.elements.sendButton.removeEventListener('touchend', this._handleTouchEnd);
    }
    if (this.elements.inputField) {
      this.elements.inputField.removeEventListener('keypress', this._handleInputKeypress);
    }
    if (this.elements.messagesContainer) {
      this.elements.messagesContainer.removeEventListener('touchstart', this._handleMessagesTouchStart);
      this.elements.messagesContainer.removeEventListener('touchmove', this._handleMessagesTouchMove);
      this.elements.messagesContainer.removeEventListener('touchend', this._handleMessagesTouchEnd);
    }
    if (this.elements.header) {
      this.elements.header.removeEventListener('touchstart', this._handleTouchStart);
      this.elements.header.removeEventListener('touchmove', this._handleTouchMove);
      this.elements.header.removeEventListener('touchend', this._handleTouchEnd);
    }

    // Remove from DOM
    if (this.elements.container && this.elements.container.parentNode) {
      this.elements.container.parentNode.removeChild(this.elements.container);
    }

    // Remove fallback element if it exists
    if (this._fallbackElement && this._fallbackElement.parentNode) {
      this._fallbackElement.parentNode.removeChild(this._fallbackElement);
      this._fallbackElement = null;
    }

    // Clear references
    this.elements = {
      container: null,
      floatingButton: null,
      chatInterface: null,
      messagesContainer: null,
      inputField: null,
      sendButton: null,
      closeButton: null,
      typingIndicator: null,
      header: null
    };

    // Reset state
    this.state = {
      isOpen: false,
      isTyping: false,
      messageCount: 0,
      hasUnread: false
    };
    
    // Reset debounce state
    this._debounceState = {
      timerId: null,
      lastSubmitTime: 0,
      isProcessing: false
    };
    
    // Reset touch state
    this._touchState = {
      startX: 0,
      startY: 0,
      startTime: 0,
      isSwiping: false,
      swipeThreshold: 50,
      tapThreshold: 10,
      swipeTimeThreshold: 300
    };
  }
}

// ES Module export
export { ChatWidget };

// CommonJS export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChatWidget };
}

// Browser global
if (typeof window !== 'undefined') {
  window.ChatWidget = ChatWidget;
}
