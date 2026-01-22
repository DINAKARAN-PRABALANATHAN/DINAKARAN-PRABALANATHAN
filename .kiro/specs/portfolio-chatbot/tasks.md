# Implementation Plan: Portfolio Chatbot

## Overview

This implementation plan breaks down the portfolio chatbot feature into discrete, incremental coding tasks. Each task builds on previous work, with testing integrated throughout to catch errors early. The implementation follows a bottom-up approach: data layer first, then logic layer, then presentation layer, and finally integration.

## Tasks

- [x] 1. Set up project structure and knowledge base
  - Create `chatbot/` directory in the project root
  - Create `chatbot/knowledge-base.js` with the complete structured data for Dinakaran's portfolio
  - Include all sections: personal info, experience (2019-present), skills, projects, awards, certifications, and contact information
  - Export the knowledge base as a JavaScript module
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [x] 1.1 Write unit tests for knowledge base data completeness
  - Verify all required fields are present in each category
  - Test that experience timeline includes entries from 2019 onwards
  - Verify contact information includes email, LinkedIn, GitHub, and location
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [x] 2. Implement KnowledgeBase class
  - Create `chatbot/KnowledgeBase.js`
  - Implement constructor that accepts structured data
  - Implement `getByCategory(category)` method to retrieve data by category
  - Implement `query(category, keywords)` method for keyword-based retrieval
  - Implement `search(keywords)` method for cross-category search with relevance scoring
  - Implement `getAllCategories()` method
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 2.1 Write unit tests for KnowledgeBase class
  - Test category retrieval returns correct data structure
  - Test keyword matching works with various query terms
  - Test search returns results sorted by relevance
  - Test edge cases: empty keywords, non-existent categories, special characters
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 3. Implement QueryProcessor class
  - Create `chatbot/QueryProcessor.js`
  - Implement constructor that accepts KnowledgeBase instance
  - Implement `detectIntent(query)` method using keyword matching to identify category
  - Implement `extractKeywords(query)` method to parse relevant terms from user input
  - Implement `generateResponse(intent, keywords, context)` method to create natural language responses
  - Implement `getSuggestions(intent)` method to provide follow-up question suggestions
  - Implement `processQuery(query, conversationContext)` as the main entry point
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 3.1 Write property test for category-based query routing
  - **Property 4: Category-Based Query Routing**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
  - Generate random queries for each category (experience, skills, projects, awards, contact, certifications)
  - Verify responses contain data exclusively from the matched category
  - Use fast-check with 100 iterations

- [x] 3.2 Write property test for unrelated query handling
  - **Property 5: Graceful Handling of Unrelated Queries**
  - **Validates: Requirements 2.7**
  - Generate random unrelated queries (gibberish, off-topic questions)
  - Verify all responses include helpful fallback messages with topic suggestions
  - Use fast-check with 100 iterations

- [x] 3.3 Write unit tests for QueryProcessor
  - Test intent detection with specific example queries
  - Test keyword extraction with various query formats
  - Test response generation includes required information (e.g., dates for awards, technologies for projects)
  - Test context-aware responses reference previous conversation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.2_

- [x] 4. Implement ConversationManager class
  - Create `chatbot/ConversationManager.js`
  - Implement constructor to initialize empty message history
  - Implement `addMessage(message, sender, timestamp)` method that returns message object with unique ID
  - Implement `getHistory()` method to return all messages
  - Implement `getContext(messageCount)` method to return recent messages for context
  - Implement `clear()` method to reset conversation
  - Implement `getGreeting()` method to return initial greeting message
  - _Requirements: 7.1, 7.2, 7.4_

- [x] 4.1 Write property test for conversation history persistence
  - **Property 3: Conversation History Persistence**
  - **Validates: Requirements 1.5**
  - Generate random conversation histories with varying message counts
  - Simulate page navigation (save/restore from sessionStorage)
  - Verify all messages are preserved without loss or modification
  - Use fast-check with 100 iterations

- [x] 4.2 Write property test for context-aware responses
  - **Property 13: Context-Aware Response Generation**
  - **Validates: Requirements 7.1, 7.2**
  - Generate random conversation sequences with follow-up questions
  - Verify responses reference or build upon previous messages
  - Use fast-check with 100 iterations

- [x] 4.3 Write unit tests for ConversationManager
  - Test message addition generates unique IDs
  - Test getContext returns correct number of recent messages
  - Test greeting message is returned on first open
  - Test clear() removes all messages
  - _Requirements: 7.1, 7.4_

- [x] 5. Checkpoint - Ensure all tests pass
  - Run all unit tests and property tests for data and logic layers
  - Verify knowledge base, query processor, and conversation manager work correctly
  - Ensure all tests pass, ask the user if questions arise

- [x] 6. Implement ChatWidget UI component
  - Create `chatbot/ChatWidget.js`
  - Implement constructor that accepts configuration (primaryColor, theme, position)
  - Create HTML structure for floating button and chat interface
  - Implement `render()` method to inject widget into DOM
  - Implement `open()` and `close()` methods for widget state management
  - Implement `addMessage(message, sender)` method to display messages with appropriate styling
  - Implement `showTypingIndicator()` and `hideTypingIndicator()` methods
  - Implement `scrollToBottom()` method for message container
  - Add event listeners for button clicks and message submission
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3, 3.4_

- [x] 6.4 Write unit tests for ChatWidget
  - Test widget renders with correct theme colors (#6366f1 for accents)
  - Test floating button is visible and positioned correctly
  - Test message display with user and bot styling
  - Test scrolling behavior with many messages
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 7.3_

- [x] 6.1 Write property test for widget open/close state transitions
  - **Property 1: Widget Open/Close State Transitions**
  - **Validates: Requirements 1.2, 1.3**
  - Generate random initial widget states
  - Verify clicking floating button when closed opens interface
  - Verify clicking close button when open minimizes interface
  - Use fast-check with 100 iterations

- [x] 6.2 Write property test for message sender visual distinction
  - **Property 6: Message Sender Visual Distinction**
  - **Validates: Requirements 3.3**
  - Generate random message pairs from different senders
  - Verify user and bot messages have different CSS classes or styles
  - Use fast-check with 100 iterations

- [x] 6.3 Write property test for typing indicator display
  - **Property 7: Typing Indicator Display**
  - **Validates: Requirements 3.4**
  - Generate random queries
  - Verify typing indicator is visible from submission until response is ready
  - Use fast-check with 100 iterations

- [x] 7. Implement ChatWidget CSS styling
  - Create `chatbot/chatbot-styles.css`
  - Style floating button with primary color #6366f1, fixed positioning, and hover effects
  - Style chat interface with dark theme, matching portfolio design
  - Style message bubbles with distinct user (right-aligned, primary color) and bot (left-aligned, gray) styling
  - Style typing indicator with animated dots
  - Add responsive styles for mobile devices (max-width: 768px)
  - Ensure widget maintains fixed position during scrolling
  - Add smooth transitions for open/close animations
  - _Requirements: 1.4, 3.1, 3.2, 3.3, 3.4, 5.1, 5.2_

- [ ]* 7.1 Write property test for widget position stability
  - **Property 2: Widget Position Stability**
  - **Validates: Requirements 1.4**
  - Generate random scroll positions
  - Verify widget maintains fixed position relative to viewport
  - Use fast-check with 100 iterations

- [ ]* 7.2 Write property test for responsive widget sizing
  - **Property 9: Responsive Widget Sizing**
  - **Validates: Requirements 5.1, 5.2**
  - Generate random viewport widths below 768px
  - Verify widget dimensions fit within viewport without overflow
  - Use fast-check with 100 iterations

- [ ]* 7.3 Write property test for layout shift prevention
  - **Property 12: Layout Shift Prevention**
  - **Validates: Requirements 6.4**
  - Test widget state changes (loading, opening, closing)
  - Verify cumulative layout shift (CLS) is zero
  - Use fast-check with 100 iterations

- [x] 8. Implement mobile touch support
  - Add touch event listeners to ChatWidget for tap, swipe interactions
  - Implement touch-friendly button sizes (minimum 44x44px)
  - Add touch feedback (active states) for interactive elements
  - Test touch interactions on mobile devices or simulators
  - _Requirements: 5.3_

- [ ]* 8.1 Write property test for touch event support
  - **Property 10: Touch Event Support**
  - **Validates: Requirements 5.3**
  - Generate random touch interactions (tap, swipe)
  - Verify corresponding actions execute correctly
  - Use fast-check with 100 iterations

- [x] 9. Implement performance optimizations
  - Add response timeout handling (2 second limit) in QueryProcessor
  - Implement message history limit (max 100 messages) in ConversationManager
  - Add lazy loading for chatbot resources (load after page DOMContentLoaded)
  - Optimize knowledge base search with early termination for high-confidence matches
  - Add debouncing for rapid user input
  - _Requirements: 6.1, 6.2, 6.5_

- [ ]* 9.1 Write property test for response time performance
  - **Property 11: Response Time Performance**
  - **Validates: Requirements 6.2**
  - Generate random queries
  - Measure response generation time
  - Verify all responses complete within 2 seconds
  - Use fast-check with 100 iterations

- [ ]* 9.2 Write unit tests for performance features
  - Test response timeout returns fallback message after 2 seconds
  - Test message history limit prevents memory issues
  - Test lazy loading doesn't block initial page render
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 10. Implement error handling
  - Add input validation in ChatWidget (empty queries, max length 500 chars)
  - Add try-catch blocks in KnowledgeBase query methods with fallback responses
  - Add error recovery in ChatWidget initialization with fallback contact link
  - Add console logging for errors (development mode only)
  - Display user-friendly error messages in chat interface
  - _Requirements: 2.7_

- [ ]* 10.1 Write unit tests for error handling
  - Test empty query rejection with appropriate error message
  - Test query length limit (500 characters)
  - Test knowledge base error fallback responses
  - Test widget initialization failure shows fallback contact link
  - _Requirements: 2.7_

- [x] 11. Checkpoint - Ensure all tests pass
  - Run complete test suite (unit tests and property tests)
  - Verify all 14 correctness properties pass
  - Test widget in browser with various queries
  - Ensure all tests pass, ask the user if questions arise

- [x] 12. Integrate chatbot into portfolio website
  - Create `chatbot/chatbot-init.js` as the main entry point
  - Initialize KnowledgeBase with data from `knowledge-base.js`
  - Initialize QueryProcessor with KnowledgeBase instance
  - Initialize ConversationManager
  - Initialize ChatWidget with configuration matching portfolio theme
  - Wire components together: connect ChatWidget message submission to QueryProcessor
  - Add sessionStorage persistence for conversation history across page navigation
  - Load chatbot asynchronously after page load
  - _Requirements: 1.5, 4.1, 4.2, 4.3, 4.4, 6.1_

- [ ]* 12.1 Write property test for no external network requests
  - **Property 8: No External Network Requests**
  - **Validates: Requirements 4.4**
  - Generate random chatbot operations (queries, widget interactions)
  - Monitor network activity
  - Verify no HTTP requests to external servers occur
  - Use fast-check with 100 iterations

- [ ]* 12.2 Write property test for suggestion provision
  - **Property 14: Suggestion Provision**
  - **Validates: Requirements 7.5**
  - Generate random queries across different categories
  - Verify bot responses include suggestion arrays when appropriate
  - Use fast-check with 100 iterations

- [ ]* 12.3 Write integration tests
  - Test complete user flow: open widget → send query → receive response → close widget
  - Test conversation persistence across simulated page navigation
  - Test multiple query types in sequence
  - Test error scenarios end-to-end
  - _Requirements: 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 7.1, 7.2_

- [x] 13. Add chatbot to HTML pages
  - Add `<link>` tag for `chatbot/chatbot-styles.css` in the `<head>` of all HTML pages
  - Add `<script>` tag for `chatbot/chatbot-init.js` at the end of `<body>` with `defer` attribute
  - Ensure chatbot loads on all pages: index.html and any other portfolio pages
  - Test chatbot appears and functions on all pages
  - _Requirements: 1.1, 4.1_

- [x] 14. Final testing and polish
  - Test chatbot with all example queries from requirements:
    - "What is your experience?"
    - "What technologies do you know?"
    - "Tell me about your projects"
    - "How can I contact you?"
    - "What awards have you won?"
  - Test mobile responsiveness on various device sizes
  - Verify dark theme consistency with portfolio design
  - Test conversation flow with follow-up questions
  - Verify greeting message appears on first open
  - Test performance: page load time, response time, memory usage
  - _Requirements: All requirements_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Run complete test suite one final time
  - Verify all 14 correctness properties pass with 100 iterations each
  - Verify all unit tests pass
  - Verify all integration tests pass
  - Test in browser across different devices and screen sizes
  - Ensure all tests pass, ask the user if questions arise

## Notes

- All tasks are required for comprehensive implementation with full test coverage
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100 iterations each
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation at key milestones
- The implementation follows a bottom-up approach: data layer → logic layer → presentation layer → integration
- All code should be written in vanilla JavaScript (ES6+) for simplicity and compatibility
- The chatbot operates entirely client-side with no backend dependencies
