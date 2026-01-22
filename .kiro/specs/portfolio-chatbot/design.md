# Design Document: Portfolio Chatbot

## Overview

The Portfolio Chatbot is a client-side conversational interface that enables visitors to interactively query information about Dinakaran Prabalanathan's professional background. The system uses a pattern-matching approach with a structured knowledge base to provide accurate, contextually relevant responses without requiring backend infrastructure.

The chatbot consists of three main layers:
1. **Presentation Layer**: A floating chat widget with a modern UI that matches the portfolio's dark theme
2. **Logic Layer**: A query processor that matches user input to knowledge base entries using keyword matching and semantic similarity
3. **Data Layer**: A structured JSON knowledge base containing all portfolio information organized by categories

The implementation prioritizes simplicity, performance, and maintainability while providing an engaging user experience.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Portfolio Website                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Chat Widget (UI)                     │  │
│  │  ┌─────────────┐  ┌──────────────┐              │  │
│  │  │   Floating  │  │     Chat     │              │  │
│  │  │   Button    │  │   Interface  │              │  │
│  │  └─────────────┘  └──────────────┘              │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Conversation Manager                      │  │
│  │  - Message history                                │  │
│  │  - Context tracking                               │  │
│  │  - State management                               │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Query Processor                           │  │
│  │  - Intent detection                               │  │
│  │  - Keyword matching                               │  │
│  │  - Response generation                            │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Knowledge Base (JSON)                     │  │
│  │  - Experience data                                │  │
│  │  - Skills & technologies                          │  │
│  │  - Projects & achievements                        │  │
│  │  - Contact information                            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Interactions

1. **User Interaction Flow**:
   - User clicks floating button → Chat interface opens
   - User types message → Message added to conversation history
   - Query sent to Query Processor → Intent detected and keywords extracted
   - Knowledge Base queried → Relevant information retrieved
   - Response generated → Displayed in chat interface

2. **State Management**:
   - Conversation state persists during session (in-memory)
   - Widget state (open/closed) managed by Chat Widget component
   - Message history maintained by Conversation Manager

## Components and Interfaces

### 1. Chat Widget Component

**Responsibilities**:
- Render floating button and chat interface
- Handle user interactions (clicks, typing, scrolling)
- Display messages with appropriate styling
- Show typing indicators during response generation
- Manage widget open/closed state

**Interface**:
```javascript
class ChatWidget {
  constructor(config) {
    // config: { primaryColor, theme, position }
  }
  
  open() {
    // Opens the chat interface
  }
  
  close() {
    // Closes the chat interface
  }
  
  addMessage(message, sender) {
    // Adds a message to the chat display
    // sender: 'user' | 'bot'
  }
  
  showTypingIndicator() {
    // Shows typing animation
  }
  
  hideTypingIndicator() {
    // Hides typing animation
  }
  
  scrollToBottom() {
    // Scrolls message container to latest message
  }
}
```

### 2. Conversation Manager

**Responsibilities**:
- Maintain message history
- Track conversation context
- Manage session state
- Provide conversation history to Query Processor for context-aware responses

**Interface**:
```javascript
class ConversationManager {
  constructor() {
    // Initializes empty conversation history
  }
  
  addMessage(message, sender, timestamp) {
    // Adds message to history
    // Returns: message object with id
  }
  
  getHistory() {
    // Returns: array of message objects
  }
  
  getContext(messageCount = 5) {
    // Returns: recent messages for context
  }
  
  clear() {
    // Clears conversation history
  }
  
  getGreeting() {
    // Returns: initial greeting message
  }
}
```

### 3. Query Processor

**Responsibilities**:
- Analyze user input to detect intent
- Extract keywords from queries
- Match queries to knowledge base categories
- Generate contextually appropriate responses
- Handle ambiguous or out-of-scope queries

**Interface**:
```javascript
class QueryProcessor {
  constructor(knowledgeBase) {
    // Initializes with knowledge base reference
  }
  
  processQuery(query, conversationContext) {
    // Analyzes query and returns response
    // Returns: { response: string, suggestions: string[] }
  }
  
  detectIntent(query) {
    // Determines query category
    // Returns: 'experience' | 'skills' | 'projects' | 'awards' | 'contact' | 'certifications' | 'general'
  }
  
  extractKeywords(query) {
    // Extracts relevant keywords
    // Returns: string[]
  }
  
  generateResponse(intent, keywords, context) {
    // Creates response based on intent and knowledge base
    // Returns: string
  }
  
  getSuggestions(intent) {
    // Provides follow-up question suggestions
    // Returns: string[]
  }
}
```

### 4. Knowledge Base

**Responsibilities**:
- Store structured portfolio information
- Provide query interface for information retrieval
- Support category-based and keyword-based lookups

**Data Structure**:
```javascript
const knowledgeBase = {
  personal: {
    name: "Dinakaran Prabalanathan",
    role: "Quality Assurance Technician",
    company: "Amazon",
    location: "Coimbatore, Tamil Nadu, India (Currently in Chennai)",
    yearsOfExperience: "5+"
  },
  
  experience: [
    {
      title: "Quality Assurance Technician",
      company: "Amazon",
      duration: "Nov 2021 - Present",
      location: "Chennai, Tamil Nadu, India",
      responsibilities: [
        "Developed automation frameworks using Playwright and Selenium",
        "Achieved $4,838 annual cost savings through automation",
        // ... more responsibilities
      ]
    },
    // ... more experience entries
  ],
  
  skills: {
    automation: ["Playwright", "Selenium", "Pytest", "Cucumber"],
    programming: ["Python", "JavaScript", "Java"],
    testing: ["BDD", "REST API Testing", "Mobile Testing", "Performance Testing"],
    cloud: ["AWS"],
    tools: ["Git", "Jenkins", "Docker"]
  },
  
  projects: [
    {
      name: "Automation Framework Development",
      description: "Built comprehensive test automation framework",
      technologies: ["Playwright", "Python", "Pytest"],
      impact: "$4,838 annual cost savings"
    },
    // ... more projects
  ],
  
  awards: [
    {
      title: "Innovation Award",
      organization: "Amazon",
      year: 2023,
      description: "Recognized for innovative automation solutions"
    },
    {
      title: "Excellence in Leadership",
      organization: "WERP-India",
      year: 2019,
      description: "Leadership excellence recognition"
    }
  ],
  
  certifications: [
    {
      name: "Playwright Python Automation Testing",
      issuer: "Udemy",
      date: "2024"
    }
  ],
  
  contact: {
    email: "dinakaranprabalanathan@gmail.com",
    linkedin: "https://linkedin.com/in/dinakaran-prabalanathan",
    github: "https://github.com/dinakaranprabalanathan",
    location: "Coimbatore, Tamil Nadu, India (Currently in Chennai)"
  }
};
```

**Interface**:
```javascript
class KnowledgeBase {
  constructor(data) {
    // Initializes with structured data
  }
  
  query(category, keywords) {
    // Retrieves information by category and keywords
    // Returns: relevant data objects
  }
  
  getByCategory(category) {
    // Returns all data for a category
    // Returns: object or array
  }
  
  search(keywords) {
    // Searches across all categories
    // Returns: array of matching results with relevance scores
  }
  
  getAllCategories() {
    // Returns: array of available categories
  }
}
```

## Data Models

### Message Model
```javascript
{
  id: string,              // Unique message identifier
  content: string,         // Message text
  sender: 'user' | 'bot',  // Message sender
  timestamp: number,       // Unix timestamp
  suggestions: string[]    // Optional follow-up suggestions (bot messages only)
}
```

### Query Result Model
```javascript
{
  response: string,        // Generated response text
  suggestions: string[],   // Follow-up question suggestions
  confidence: number,      // Confidence score (0-1)
  sources: string[]        // Knowledge base categories used
}
```

### Widget State Model
```javascript
{
  isOpen: boolean,         // Chat interface visibility
  isTyping: boolean,       // Typing indicator state
  messageCount: number,    // Number of messages in conversation
  hasUnread: boolean       // Unread message indicator (when minimized)
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Widget Open/Close State Transitions

*For any* initial widget state, clicking the floating button when closed should open the chat interface, and clicking the close button when open should minimize the interface back to the floating button.

**Validates: Requirements 1.2, 1.3**

### Property 2: Widget Position Stability

*For any* scroll position on the page, the chat widget should maintain its fixed position relative to the viewport without shifting or moving.

**Validates: Requirements 1.4**

### Property 3: Conversation History Persistence

*For any* conversation history, navigating between pages should preserve all messages in the conversation without loss or modification.

**Validates: Requirements 1.5**

### Property 4: Category-Based Query Routing

*For any* query that matches a knowledge base category (experience, skills, projects, awards, contact, certifications), the response should contain information exclusively from that category's data.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

### Property 5: Graceful Handling of Unrelated Queries

*For any* query that does not match known categories or contains unrelated content, the response should provide a helpful fallback message with suggestions for valid topics.

**Validates: Requirements 2.7**

### Property 6: Message Sender Visual Distinction

*For any* pair of consecutive messages from different senders (user and bot), the messages should have visually distinct styling (different CSS classes or styles).

**Validates: Requirements 3.3**

### Property 7: Typing Indicator Display

*For any* query submission, the typing indicator should be visible from the moment the query is submitted until the response is ready to display.

**Validates: Requirements 3.4**

### Property 8: No External Network Requests

*For any* chatbot operation (query processing, response generation, widget interaction), no HTTP requests should be made to external servers.

**Validates: Requirements 4.4**

### Property 9: Responsive Widget Sizing

*For any* viewport width below 768px (mobile breakpoint), the chat widget dimensions should adjust to fit within the viewport bounds without horizontal overflow.

**Validates: Requirements 5.1, 5.2**

### Property 10: Touch Event Support

*For any* touch interaction (tap, swipe) on the chat widget, the corresponding action (open, close, scroll, send message) should execute correctly.

**Validates: Requirements 5.3**

### Property 11: Response Time Performance

*For any* user query, the response should be generated and displayed within 2 seconds of submission.

**Validates: Requirements 6.2**

### Property 12: Layout Shift Prevention

*For any* widget state change (loading, opening, closing), the cumulative layout shift (CLS) should be zero, meaning no other page elements should move.

**Validates: Requirements 6.4**

### Property 13: Context-Aware Response Generation

*For any* follow-up question in a conversation, the response should reference or build upon information from previous messages in the conversation history.

**Validates: Requirements 7.1, 7.2**

### Property 14: Suggestion Provision

*For any* bot response, when appropriate based on the query category, the response should include an array of related follow-up question suggestions.

**Validates: Requirements 7.5**

## Error Handling

### Error Categories

1. **Invalid Input Errors**
   - Empty queries
   - Queries with only whitespace
   - Queries exceeding maximum length (500 characters)

2. **Knowledge Base Errors**
   - Missing category data
   - Malformed knowledge base structure
   - Failed JSON parsing

3. **UI Rendering Errors**
   - Failed DOM element creation
   - CSS loading failures
   - Event listener attachment failures

4. **Performance Errors**
   - Response generation timeout (>2 seconds)
   - Memory limit exceeded
   - Excessive message history (>100 messages)

### Error Handling Strategies

**Invalid Input Handling**:
```javascript
function validateQuery(query) {
  if (!query || query.trim().length === 0) {
    return {
      isValid: false,
      error: "Please enter a question or message."
    };
  }
  
  if (query.length > 500) {
    return {
      isValid: false,
      error: "Your message is too long. Please keep it under 500 characters."
    };
  }
  
  return { isValid: true };
}
```

**Knowledge Base Error Handling**:
```javascript
function safeKnowledgeBaseQuery(category, keywords) {
  try {
    const result = knowledgeBase.query(category, keywords);
    
    if (!result || result.length === 0) {
      return {
        success: false,
        fallback: "I don't have specific information about that. You can ask me about my experience, skills, projects, awards, or contact information."
      };
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Knowledge base query error:", error);
    return {
      success: false,
      fallback: "I'm having trouble accessing that information right now. Please try asking about something else."
    };
  }
}
```

**Response Timeout Handling**:
```javascript
async function generateResponseWithTimeout(query, timeout = 2000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Response timeout")), timeout);
  });
  
  const responsePromise = queryProcessor.processQuery(query);
  
  try {
    return await Promise.race([responsePromise, timeoutPromise]);
  } catch (error) {
    if (error.message === "Response timeout") {
      return {
        response: "I'm taking longer than usual to respond. Let me try to answer more quickly: " + 
                  generateSimplifiedResponse(query),
        suggestions: []
      };
    }
    throw error;
  }
}
```

**UI Error Recovery**:
```javascript
function initializeChatWidget() {
  try {
    const widget = new ChatWidget({
      primaryColor: "#6366f1",
      theme: "dark",
      position: "bottom-right"
    });
    
    widget.render();
    return widget;
  } catch (error) {
    console.error("Failed to initialize chat widget:", error);
    
    // Fallback: show simple contact link
    const fallbackButton = document.createElement("a");
    fallbackButton.href = "mailto:dinakaranprabalanathan@gmail.com";
    fallbackButton.textContent = "Contact Me";
    fallbackButton.className = "chat-fallback-button";
    document.body.appendChild(fallbackButton);
    
    return null;
  }
}
```

### Error Messages

All error messages should be:
- User-friendly and non-technical
- Actionable (suggest what the user can do)
- Consistent in tone with the chatbot's personality
- Logged to console for debugging (in development mode)

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Library Selection**: Use **fast-check** for JavaScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test must reference its design document property using a comment tag
- Tag format: `// Feature: portfolio-chatbot, Property {number}: {property_text}`

**Example Property Test**:
```javascript
import fc from 'fast-check';

// Feature: portfolio-chatbot, Property 4: Category-Based Query Routing
test('queries matching a category return data from that category only', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('experience', 'skills', 'projects', 'awards', 'contact', 'certifications'),
      fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
      (category, keywords) => {
        const query = keywords.join(' ');
        const response = queryProcessor.processQuery(query);
        
        // Verify response contains data from the correct category
        const responseCategory = detectResponseCategory(response.response);
        expect(responseCategory).toBe(category);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Focus Areas**:
- Specific user interaction scenarios (button clicks, message sending)
- Edge cases (empty queries, very long queries, special characters)
- Error conditions (network failures, malformed data, timeout scenarios)
- Integration points (widget initialization, knowledge base loading)

**Example Unit Tests**:
```javascript
describe('ChatWidget', () => {
  test('displays greeting message on first open', () => {
    const widget = new ChatWidget(config);
    widget.open();
    
    const messages = widget.getMessages();
    expect(messages[0].content).toContain('Hello');
    expect(messages[0].sender).toBe('bot');
  });
  
  test('rejects empty queries', () => {
    const widget = new ChatWidget(config);
    const result = widget.sendMessage('   ');
    
    expect(result.error).toBe('Please enter a question or message.');
  });
  
  test('handles queries exceeding max length', () => {
    const widget = new ChatWidget(config);
    const longQuery = 'a'.repeat(501);
    const result = widget.sendMessage(longQuery);
    
    expect(result.error).toContain('too long');
  });
});
```

### Test Coverage Goals

- **Code Coverage**: Minimum 80% line coverage
- **Property Coverage**: All 14 correctness properties must have corresponding property tests
- **Edge Case Coverage**: All error conditions and edge cases must have unit tests
- **Integration Coverage**: All component interactions must be tested

### Testing Tools

- **Test Runner**: Jest or Vitest
- **Property Testing**: fast-check
- **DOM Testing**: @testing-library/dom
- **Coverage**: Istanbul/nyc
- **Mobile Testing**: Viewport simulation with various device sizes

### Continuous Testing

- Run unit tests on every code change
- Run property tests before commits
- Run full test suite in CI/CD pipeline
- Monitor test execution time (should complete in <30 seconds)
