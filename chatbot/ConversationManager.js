/**
 * ConversationManager Class
 * 
 * Manages conversation state, message history, and context tracking for the chatbot.
 * Provides methods for adding messages, retrieving history, and managing conversation context.
 * 
 * Requirements: 7.1, 7.2, 7.4, 6.3
 */

class ConversationManager {
  /**
   * Maximum number of messages to retain in history
   * Prevents memory issues in long conversations
   * @static
   */
  static MAX_MESSAGE_HISTORY = 100;

  /**
   * Initializes the ConversationManager with empty message history
   * @param {Object} [options] - Configuration options
   * @param {number} [options.maxMessages] - Maximum messages to retain (default: 100)
   */
  constructor(options = {}) {
    this.messages = [];
    this.messageIdCounter = 0;
    this.maxMessages = options.maxMessages || ConversationManager.MAX_MESSAGE_HISTORY;
  }

  /**
   * Generates a unique message ID
   * @private
   * @returns {string} - Unique message identifier
   */
  _generateId() {
    this.messageIdCounter++;
    return `msg_${Date.now()}_${this.messageIdCounter}`;
  }

  /**
   * Adds a message to the conversation history
   * @param {string} message - The message content
   * @param {string} sender - The sender ('user' or 'bot')
   * @param {number} [timestamp] - Optional Unix timestamp (defaults to current time)
   * @returns {Object} - The message object with unique ID
   */
  addMessage(message, sender, timestamp = null) {
    // Validate message content
    if (message === undefined || message === null) {
      throw new Error('Message content is required');
    }

    // Validate sender
    const validSenders = ['user', 'bot'];
    if (!sender || !validSenders.includes(sender)) {
      throw new Error('Sender must be either "user" or "bot"');
    }

    // Create message object
    const messageObject = {
      id: this._generateId(),
      content: String(message),
      sender: sender,
      timestamp: timestamp !== null ? timestamp : Date.now()
    };

    // Add to history
    this.messages.push(messageObject);

    // Enforce message history limit to prevent memory issues
    this._enforceMessageLimit();

    return messageObject;
  }

  /**
   * Enforces the maximum message history limit
   * Removes oldest messages when limit is exceeded
   * @private
   * Requirements: 6.3
   */
  _enforceMessageLimit() {
    if (this.messages.length > this.maxMessages) {
      // Remove oldest messages to stay within limit
      const excessCount = this.messages.length - this.maxMessages;
      this.messages.splice(0, excessCount);
    }
  }

  /**
   * Gets the current maximum message limit
   * @returns {number} - Maximum number of messages allowed
   */
  getMaxMessages() {
    return this.maxMessages;
  }

  /**
   * Sets a new maximum message limit
   * @param {number} limit - New maximum message limit
   */
  setMaxMessages(limit) {
    if (typeof limit === 'number' && limit > 0) {
      this.maxMessages = limit;
      this._enforceMessageLimit();
    }
  }

  /**
   * Returns all messages in the conversation history
   * @returns {Array} - Array of message objects
   */
  getHistory() {
    return [...this.messages];
  }

  /**
   * Returns recent messages for context-aware responses
   * @param {number} [messageCount=5] - Number of recent messages to return
   * @returns {Array} - Array of recent message objects
   */
  getContext(messageCount = 5) {
    // Validate messageCount
    if (typeof messageCount !== 'number' || messageCount < 0) {
      messageCount = 5;
    }

    // Return the most recent messages
    const startIndex = Math.max(0, this.messages.length - messageCount);
    return this.messages.slice(startIndex);
  }

  /**
   * Clears all messages from the conversation history
   */
  clear() {
    this.messages = [];
    // Note: We don't reset messageIdCounter to ensure IDs remain unique
    // even after clearing the conversation
  }

  /**
   * Returns the initial greeting message for the chatbot
   * @returns {Object} - Greeting message object
   */
  getGreeting() {
    const greetingContent = "👋 Hello! I'm Dinakaran's portfolio assistant. I can help you learn about his professional experience, skills, projects, awards, certifications, and contact information. What would you like to know?";
    
    return {
      content: greetingContent,
      sender: 'bot',
      suggestions: [
        "What is your experience?",
        "What technologies do you know?",
        "Tell me about your projects",
        "How can I contact you?"
      ]
    };
  }

  /**
   * Returns the total number of messages in the conversation
   * @returns {number} - Message count
   */
  getMessageCount() {
    return this.messages.length;
  }

  /**
   * Checks if the conversation has any messages
   * @returns {boolean} - True if conversation has messages
   */
  hasMessages() {
    return this.messages.length > 0;
  }

  /**
   * Gets the last message in the conversation
   * @returns {Object|null} - The last message object or null if empty
   */
  getLastMessage() {
    if (this.messages.length === 0) {
      return null;
    }
    return this.messages[this.messages.length - 1];
  }

  /**
   * Gets messages by sender type
   * @param {string} sender - The sender type ('user' or 'bot')
   * @returns {Array} - Array of messages from the specified sender
   */
  getMessagesBySender(sender) {
    return this.messages.filter(msg => msg.sender === sender);
  }

  /**
   * Serializes the conversation history for storage (e.g., sessionStorage)
   * @returns {string} - JSON string of conversation data
   */
  serialize() {
    return JSON.stringify({
      messages: this.messages,
      messageIdCounter: this.messageIdCounter
    });
  }

  /**
   * Restores conversation history from serialized data
   * @param {string} data - JSON string of conversation data
   * @returns {boolean} - True if restoration was successful
   */
  restore(data) {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.messages && Array.isArray(parsed.messages)) {
        this.messages = parsed.messages;
      }
      
      if (typeof parsed.messageIdCounter === 'number') {
        this.messageIdCounter = parsed.messageIdCounter;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to restore conversation:', error);
      return false;
    }
  }
}

// ES Module export
export { ConversationManager };

// CommonJS export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConversationManager };
}

// Browser global
if (typeof window !== 'undefined') {
  window.ConversationManager = ConversationManager;
}
