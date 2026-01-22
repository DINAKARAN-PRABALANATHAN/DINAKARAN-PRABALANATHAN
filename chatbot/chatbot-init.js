/**
 * Chatbot Initialization Module
 * 
 * Main entry point for the portfolio chatbot. Wires together all components:
 * - KnowledgeBase: Structured portfolio data
 * - QueryProcessor: Intent detection and response generation
 * - ConversationManager: Message history and context tracking
 * - ChatWidget: UI component
 * 
 * Features:
 * - Asynchronous loading after page load (doesn't block initial render)
 * - sessionStorage persistence for conversation history across page navigation
 * - Lazy loading via ChatbotLoader
 * 
 * Requirements: 1.5, 4.1, 4.2, 4.3, 4.4, 6.1
 */

// Import dependencies
import { knowledgeBase } from './knowledge-base.js';
import { KnowledgeBase } from './KnowledgeBase.js';
import { QueryProcessor } from './QueryProcessor.js';
import { ConversationManager } from './ConversationManager.js';
import { ChatWidget } from './ChatWidget.js';
import { ChatbotLoader } from './chatbot-loader.js';

/**
 * Storage key for conversation history in sessionStorage
 * @constant
 */
const CONVERSATION_STORAGE_KEY = 'portfolio_chatbot_conversation';

/**
 * Storage key for widget state in sessionStorage
 * @constant
 */
const WIDGET_STATE_STORAGE_KEY = 'portfolio_chatbot_widget_state';

/**
 * Chatbot configuration matching portfolio theme
 * @constant
 */
const CHATBOT_CONFIG = {
  primaryColor: '#6366f1',
  theme: 'dark',
  position: 'bottom-right'
};

/**
 * Saves conversation history to sessionStorage
 * @param {ConversationManager} conversationManager - The conversation manager instance
 * Requirements: 1.5
 */
function saveConversationToStorage(conversationManager) {
  try {
    const serialized = conversationManager.serialize();
    sessionStorage.setItem(CONVERSATION_STORAGE_KEY, serialized);
  } catch (error) {
    // sessionStorage might be unavailable or full
    console.warn('[Chatbot] Failed to save conversation to storage:', error);
  }
}

/**
 * Restores conversation history from sessionStorage
 * @param {ConversationManager} conversationManager - The conversation manager instance
 * @returns {boolean} - True if restoration was successful
 * Requirements: 1.5
 */
function restoreConversationFromStorage(conversationManager) {
  try {
    const stored = sessionStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (stored) {
      return conversationManager.restore(stored);
    }
    return false;
  } catch (error) {
    console.warn('[Chatbot] Failed to restore conversation from storage:', error);
    return false;
  }
}

/**
 * Saves widget state to sessionStorage
 * @param {Object} state - Widget state object
 */
function saveWidgetStateToStorage(state) {
  try {
    sessionStorage.setItem(WIDGET_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[Chatbot] Failed to save widget state to storage:', error);
  }
}

/**
 * Restores widget state from sessionStorage
 * @returns {Object|null} - Widget state object or null
 */
function restoreWidgetStateFromStorage() {
  try {
    const stored = sessionStorage.getItem(WIDGET_STATE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.warn('[Chatbot] Failed to restore widget state from storage:', error);
    return null;
  }
}

/**
 * Initializes and wires together all chatbot components
 * @returns {Object} - Object containing all chatbot component instances
 * Requirements: 4.1, 4.2, 4.3
 */
function initializeChatbot() {
  // Initialize KnowledgeBase with portfolio data
  // Requirements: 4.2 - Knowledge base embedded in client-side code
  const kb = new KnowledgeBase(knowledgeBase);

  // Initialize QueryProcessor with KnowledgeBase
  // Requirements: 4.3 - Client-side logic for query matching
  const queryProcessor = new QueryProcessor(kb);

  // Initialize ConversationManager
  const conversationManager = new ConversationManager();

  // Restore conversation history from sessionStorage if available
  // Requirements: 1.5 - Preserve conversation history across page navigation
  const wasRestored = restoreConversationFromStorage(conversationManager);

  // Initialize ChatWidget with portfolio theme configuration
  const chatWidget = new ChatWidget(CHATBOT_CONFIG);

  // Wire components together: connect ChatWidget message submission to QueryProcessor
  chatWidget.onMessageSubmit = async (message) => {
    // Add user message to conversation history
    conversationManager.addMessage(message, 'user');
    
    // Display user message in widget
    chatWidget.addMessage(message, 'user');
    
    // Show typing indicator while processing
    chatWidget.showTypingIndicator();
    
    // Get conversation context for context-aware responses
    const context = conversationManager.getContext(5);
    
    // Process query with timeout handling
    // Requirements: 4.4 - No external server calls, all client-side
    const result = await queryProcessor.processQueryWithTimeout(message, context);
    
    // Hide typing indicator
    chatWidget.hideTypingIndicator();
    
    // Add bot response to conversation history
    conversationManager.addMessage(result.response, 'bot');
    
    // Display bot response with suggestions
    chatWidget.addMessage(result.response, 'bot', {
      suggestions: result.suggestions
    });
    
    // Save conversation to sessionStorage after each exchange
    // Requirements: 1.5 - Preserve conversation history
    saveConversationToStorage(conversationManager);
  };

  // Handle widget open event
  chatWidget.onOpen = () => {
    // Save widget state
    saveWidgetStateToStorage({ isOpen: true });
    
    // If this is a fresh conversation (no messages), show greeting
    if (!conversationManager.hasMessages()) {
      const greeting = conversationManager.getGreeting();
      conversationManager.addMessage(greeting.content, 'bot');
      chatWidget.addMessage(greeting.content, 'bot', {
        suggestions: greeting.suggestions
      });
      saveConversationToStorage(conversationManager);
    }
  };

  // Handle widget close event
  chatWidget.onClose = () => {
    saveWidgetStateToStorage({ isOpen: false });
  };

  // Render the widget
  const renderSuccess = chatWidget.render(document.body);

  // If widget rendered successfully and conversation was restored, display messages
  if (renderSuccess && wasRestored) {
    const history = conversationManager.getHistory();
    for (const msg of history) {
      chatWidget.addMessage(msg.content, msg.sender);
    }
  }

  // Restore widget state (open/closed)
  const savedWidgetState = restoreWidgetStateFromStorage();
  if (savedWidgetState && savedWidgetState.isOpen) {
    chatWidget.open();
  }

  // Return component instances for potential external access
  return {
    knowledgeBase: kb,
    queryProcessor,
    conversationManager,
    chatWidget
  };
}

/**
 * Main initialization using ChatbotLoader for lazy loading
 * Requirements: 6.1 - Load asynchronously without blocking initial page render
 */
ChatbotLoader.lazyLoad(initializeChatbot)
  .then((chatbot) => {
    // Make chatbot instance available globally for debugging/testing
    if (typeof window !== 'undefined') {
      window.portfolioChatbot = chatbot;
    }
    console.log('[Chatbot] Portfolio chatbot initialized successfully');
  })
  .catch((error) => {
    console.error('[Chatbot] Failed to initialize portfolio chatbot:', error);
  });

// Export for testing purposes
export { initializeChatbot, CHATBOT_CONFIG, CONVERSATION_STORAGE_KEY, WIDGET_STATE_STORAGE_KEY };
