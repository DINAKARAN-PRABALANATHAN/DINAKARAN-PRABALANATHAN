/**
 * QueryProcessor Class
 * 
 * Analyzes user input to detect intent, extract keywords, and generate
 * contextually appropriate responses using the knowledge base.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.2
 */

class QueryProcessor {
  /**
   * Initializes the QueryProcessor with a KnowledgeBase instance
   * @param {KnowledgeBase} knowledgeBase - The knowledge base to query
   * @param {Object} [options] - Configuration options
   * @param {number} [options.responseTimeout=2000] - Response timeout in milliseconds
   */
  constructor(knowledgeBase, options = {}) {
    if (!knowledgeBase) {
      throw new Error('QueryProcessor requires a KnowledgeBase instance');
    }
    this.knowledgeBase = knowledgeBase;
    
    // Performance configuration
    this.responseTimeout = options.responseTimeout || 2000; // 2 second default timeout
    
    // Intent patterns for category detection
    // High-priority patterns are specific to each category and should be weighted more heavily
    this.intentPatterns = {
      experience: {
        high: ['experience', 'career', 'employment', 'job history', 'work history', 'positions held', 'professional background', 'positions', 'work experience'],
        medium: ['work', 'job', 'worked', 'working', 'position', 'role', 'company', 'amazon', 'werp', 'history', 'background', 'professional', 'timeline', 'years', 'held', 'jobs']
      },
      skills: {
        high: ['skill', 'skills', 'technology', 'technologies', 'programming', 'technical abilities', 'expertise'],
        medium: ['tech', 'know', 'language', 'languages', 'framework', 'frameworks', 'tool', 'tools', 'proficient', 'capable', 'ability', 'abilities', 'competent', 'python', 'javascript', 'playwright', 'selenium', 'pytest', 'aws', 'cloud']
      },
      projects: {
        high: ['project', 'projects', 'portfolio work', 'what have you built', 'what did you build', 'framework development'],
        medium: ['built', 'build', 'created', 'developed', 'development', 'savings', 'cost', 'impact', 'solutions']
      },
      awards: {
        high: ['award', 'awards', 'recognition', 'recognized', 'honors', 'prize', 'prizes', 'accomplishment', 'accomplishments', 'accolades'],
        medium: ['achievement', 'achievements', 'honor', 'won', 'received', 'innovation', 'excellence', 'leadership']
      },
      contact: {
        high: ['contact', 'email', 'linkedin', 'github', 'reach out', 'get in touch', 'how to reach'],
        medium: ['reach', 'connect', 'social', 'message', 'hire', 'hiring', 'location', 'where', 'based', 'live', 'located', 'find', 'touch']
      },
      certifications: {
        high: ['certification', 'certifications', 'certified', 'certificate', 'certificates', 'qualifications', 'credentials', 'credential'],
        medium: ['course', 'courses', 'training', 'learn', 'learned', 'education', 'qualification']
      },
      personal: {
        high: ['who are you', 'about yourself', 'introduce yourself', 'introduction', 'dinakaran'],
        medium: ['who', 'yourself', 'introduce', 'name', 'summary', 'overview', 'describe yourself']
      }
    };

    // Stop words to filter out during keyword extraction
    this.stopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
      'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
      'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
      'below', 'between', 'under', 'again', 'further', 'then', 'once',
      'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few',
      'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
      'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but',
      'if', 'or', 'because', 'until', 'while', 'although', 'though',
      'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
      'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
      'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
      'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
      'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'been',
      'being', 'having', 'doing', 'would', 'could', 'should', 'might',
      'tell', 'know', 'please', 'thanks', 'thank', 'hello', 'hi', 'hey'
    ]);

    // Suggestions for each intent category
    this.suggestionsByIntent = {
      experience: [
        "What technologies do you use at Amazon?",
        "Tell me about your projects",
        "What awards have you received?"
      ],
      skills: [
        "What projects have you worked on?",
        "Tell me about your experience",
        "What certifications do you have?"
      ],
      projects: [
        "What was the impact of your projects?",
        "What technologies do you know?",
        "How can I contact you?"
      ],
      awards: [
        "Tell me about your experience at Amazon",
        "What projects have you worked on?",
        "What are your skills?"
      ],
      contact: [
        "Tell me about your experience",
        "What projects have you worked on?",
        "What are your skills?"
      ],
      certifications: [
        "What skills do you have?",
        "Tell me about your experience",
        "What projects have you worked on?"
      ],
      personal: [
        "What is your experience?",
        "What technologies do you know?",
        "Tell me about your projects"
      ],
      general: [
        "What is your experience?",
        "What technologies do you know?",
        "Tell me about your projects",
        "How can I contact you?"
      ]
    };
  }

  /**
   * Main entry point for processing user queries
   * @param {string} query - The user's query
   * @param {Object} conversationContext - Previous conversation context
   * @returns {Object} - { response: string, suggestions: string[] }
   */
  processQuery(query, conversationContext = null) {
    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return {
        response: "I didn't catch that. Could you please ask me something about Dinakaran's experience, skills, projects, or how to contact him?",
        suggestions: this.suggestionsByIntent.general
      };
    }

    const normalizedQuery = query.trim().toLowerCase();
    
    // Detect intent from the query
    const intent = this.detectIntent(normalizedQuery);
    
    // Extract keywords for more specific matching
    const keywords = this.extractKeywords(normalizedQuery);
    
    // Generate response based on intent and keywords
    const response = this.generateResponse(intent, keywords, conversationContext);
    
    // Get follow-up suggestions
    const suggestions = this.getSuggestions(intent);

    return {
      response,
      suggestions
    };
  }

  /**
   * Processes a query with timeout handling
   * Returns a fallback message if processing exceeds the timeout limit
   * @param {string} query - The user's query
   * @param {Object} conversationContext - Previous conversation context
   * @param {number} [timeout] - Optional custom timeout in milliseconds
   * @returns {Promise<Object>} - { response: string, suggestions: string[] }
   * Requirements: 6.2
   */
  async processQueryWithTimeout(query, conversationContext = null, timeout = null) {
    const timeoutMs = timeout || this.responseTimeout;
    
    return new Promise((resolve) => {
      // Set up timeout handler
      const timeoutId = setTimeout(() => {
        resolve({
          response: this._generateTimeoutFallbackResponse(query),
          suggestions: this.suggestionsByIntent.general,
          timedOut: true
        });
      }, timeoutMs);

      // Process the query synchronously (wrapped in try-catch for safety)
      try {
        const result = this.processQuery(query, conversationContext);
        clearTimeout(timeoutId);
        resolve({
          ...result,
          timedOut: false
        });
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error processing query:', error);
        resolve({
          response: this._generateErrorFallbackResponse(),
          suggestions: this.suggestionsByIntent.general,
          timedOut: false,
          error: true
        });
      }
    });
  }

  /**
   * Generates a fallback response when query processing times out
   * @private
   * @param {string} query - The original query
   * @returns {string} - Fallback response message
   */
  _generateTimeoutFallbackResponse(query) {
    // Try to provide a quick, simplified response based on detected intent
    const normalizedQuery = query ? query.trim().toLowerCase() : '';
    const intent = this.detectIntent(normalizedQuery);
    
    const quickResponses = {
      experience: "Dinakaran has over 5 years of experience in QA and automation testing, currently working at Amazon. Feel free to ask for more details!",
      skills: "Dinakaran is skilled in Playwright, Selenium, Python, JavaScript, and various testing frameworks. What specific skill would you like to know more about?",
      projects: "Dinakaran has worked on automation frameworks that saved thousands of dollars annually. Ask me for specific project details!",
      awards: "Dinakaran has received recognition including an Innovation Award from Amazon. Would you like to know more?",
      contact: "You can reach Dinakaran at dinakaranprabalanathan@gmail.com or connect on LinkedIn. Need more contact options?",
      certifications: "Dinakaran holds certifications in Playwright and Python automation. Want to know more details?",
      personal: "Dinakaran Prabalanathan is a QA Technician at Amazon with expertise in automation testing. What would you like to know?",
      general: "I'm here to help! You can ask about Dinakaran's experience, skills, projects, awards, or contact information."
    };

    return quickResponses[intent] || quickResponses.general;
  }

  /**
   * Generates a fallback response when an error occurs
   * @private
   * @returns {string} - Error fallback response message
   */
  _generateErrorFallbackResponse() {
    return "I'm having a bit of trouble processing that request. Could you try rephrasing your question? You can ask about experience, skills, projects, awards, or contact information.";
  }

  /**
   * Detects the intent/category of a query using keyword matching
   * @param {string} query - The normalized query string
   * @returns {string} - The detected intent category
   */
  detectIntent(query) {
    if (!query || typeof query !== 'string') {
      return 'general';
    }

    const normalizedQuery = query.toLowerCase().trim();
    const scores = {};

    // Calculate score for each intent based on keyword matches
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      scores[intent] = 0;
      
      // Check high-priority patterns first (weight: 5 for phrase match, 4 for word match)
      if (patterns.high) {
        for (const pattern of patterns.high) {
          // Check for phrase match first
          if (normalizedQuery.includes(pattern)) {
            scores[intent] += 5;
          } else {
            // Check for word boundary match
            const regex = new RegExp(`\\b${this._escapeRegex(pattern)}\\b`, 'i');
            if (regex.test(normalizedQuery)) {
              scores[intent] += 4;
            }
          }
        }
      }
      
      // Check medium-priority patterns (weight: 2 for word match, 1 for partial)
      if (patterns.medium) {
        for (const pattern of patterns.medium) {
          const regex = new RegExp(`\\b${this._escapeRegex(pattern)}\\b`, 'i');
          if (regex.test(normalizedQuery)) {
            scores[intent] += 2;
          } else if (normalizedQuery.includes(pattern)) {
            scores[intent] += 1;
          }
        }
      }
    }

    // Find the intent with the highest score
    let maxScore = 0;
    let detectedIntent = 'general';

    for (const [intent, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intent;
      }
    }

    // If no significant match found, return 'general'
    if (maxScore < 2) {
      return 'general';
    }

    return detectedIntent;
  }

  /**
   * Extracts relevant keywords from a query
   * @param {string} query - The query string
   * @returns {string[]} - Array of extracted keywords
   */
  extractKeywords(query) {
    if (!query || typeof query !== 'string') {
      return [];
    }

    // Tokenize the query
    const tokens = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(token => token.length > 1); // Remove single characters

    // Filter out stop words and return unique keywords
    const keywords = tokens.filter(token => !this.stopWords.has(token));
    
    return [...new Set(keywords)];
  }

  /**
   * Generates a natural language response based on intent and keywords
   * @param {string} intent - The detected intent
   * @param {string[]} keywords - Extracted keywords
   * @param {Object} context - Conversation context
   * @returns {string} - The generated response
   */
  generateResponse(intent, keywords, context = null) {
    // Handle general/unknown intent
    if (intent === 'general') {
      return this._generateFallbackResponse();
    }

    // Map intent to knowledge base category
    const categoryMap = {
      experience: 'experience',
      skills: 'skills',
      projects: 'projects',
      awards: 'awards',
      contact: 'contact',
      certifications: 'certifications',
      personal: 'personal'
    };

    const category = categoryMap[intent];
    
    if (!category) {
      return this._generateFallbackResponse();
    }

    // Get data from knowledge base
    const data = this.knowledgeBase.getByCategory(category);
    
    if (!data) {
      return this._generateFallbackResponse();
    }

    // Generate response based on category
    switch (intent) {
      case 'experience':
        return this._formatExperienceResponse(data, keywords, context);
      case 'skills':
        return this._formatSkillsResponse(data, keywords, context);
      case 'projects':
        return this._formatProjectsResponse(data, keywords, context);
      case 'awards':
        return this._formatAwardsResponse(data, keywords, context);
      case 'contact':
        return this._formatContactResponse(data, keywords, context);
      case 'certifications':
        return this._formatCertificationsResponse(data, keywords, context);
      case 'personal':
        return this._formatPersonalResponse(data, keywords, context);
      default:
        return this._generateFallbackResponse();
    }
  }

  /**
   * Provides follow-up question suggestions based on intent
   * @param {string} intent - The current intent
   * @returns {string[]} - Array of suggestion strings
   */
  getSuggestions(intent) {
    return this.suggestionsByIntent[intent] || this.suggestionsByIntent.general;
  }

  // ============ Private Helper Methods ============

  /**
   * Generates a fallback response for unrecognized queries
   * @private
   * @returns {string}
   */
  _generateFallbackResponse() {
    const fallbackResponses = [
      "I'm not sure I understand that question. I can help you learn about Dinakaran's experience, skills, projects, awards, certifications, or contact information. What would you like to know?",
      "I'd be happy to help! You can ask me about Dinakaran's professional experience, technical skills, projects he's worked on, awards he's received, or how to get in touch with him.",
      "That's an interesting question! I'm best at answering questions about Dinakaran's background. Try asking about his experience at Amazon, his automation skills, or his projects."
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  /**
   * Formats experience data into a natural response
   * @private
   */
  _formatExperienceResponse(data, keywords, context) {
    if (!Array.isArray(data) || data.length === 0) {
      return "Dinakaran has over 5 years of professional experience in quality assurance and automation testing.";
    }

    let response = "Here's an overview of Dinakaran's career journey and professional experience:\n\n";
    
    for (const exp of data) {
      response += `**${exp.title}** at ${exp.company}\n`;
      response += `📅 ${exp.duration} | 📍 ${exp.location}\n`;
      
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        response += "Key responsibilities:\n";
        for (const resp of exp.responsibilities.slice(0, 3)) {
          response += `• ${resp}\n`;
        }
      }
      
      if (exp.technologies && exp.technologies.length > 0) {
        response += `Technologies: ${exp.technologies.join(', ')}\n`;
      }
      
      response += "\n";
    }

    return response.trim();
  }

  /**
   * Formats skills data into a natural response
   * @private
   */
  _formatSkillsResponse(data, keywords, context) {
    if (!data || typeof data !== 'object') {
      return "Dinakaran is skilled in automation testing, Python, JavaScript, Playwright, and Selenium.";
    }

    let response = "Here are Dinakaran's technical skills:\n\n";

    const categoryLabels = {
      automation: "🤖 Automation Tools",
      programming: "💻 Programming Languages",
      testing: "🧪 Testing Expertise",
      methodologies: "📋 Methodologies",
      cloud: "☁️ Cloud Platforms",
      tools: "🔧 Tools & Platforms",
      frameworks: "📦 Frameworks"
    };

    for (const [category, skills] of Object.entries(data)) {
      if (Array.isArray(skills) && skills.length > 0) {
        const label = categoryLabels[category] || category;
        response += `${label}:\n`;
        response += `${skills.join(', ')}\n\n`;
      }
    }

    return response.trim();
  }

  /**
   * Formats projects data into a natural response
   * @private
   */
  _formatProjectsResponse(data, keywords, context) {
    if (!Array.isArray(data) || data.length === 0) {
      return "Dinakaran has worked on several automation projects that have saved thousands of dollars annually.";
    }

    let response = "Here are some of Dinakaran's notable projects:\n\n";

    for (const project of data) {
      response += `**${project.name}**\n`;
      response += `${project.description}\n`;
      
      if (project.technologies && project.technologies.length > 0) {
        response += `🛠️ Technologies: ${project.technologies.join(', ')}\n`;
      }
      
      if (project.impact) {
        response += `📈 Impact: ${project.impact}\n`;
      }
      
      response += "\n";
    }

    return response.trim();
  }

  /**
   * Formats awards data into a natural response
   * @private
   */
  _formatAwardsResponse(data, keywords, context) {
    if (!Array.isArray(data) || data.length === 0) {
      return "Dinakaran has received recognition for his innovative work and leadership.";
    }

    let response = "Here are Dinakaran's awards and recognitions:\n\n";

    for (const award of data) {
      response += `🏆 **${award.title}**\n`;
      response += `Awarded by: ${award.organization} | Year: ${award.year}\n`;
      
      if (award.description) {
        response += `${award.description}\n`;
      }
      
      response += "\n";
    }

    return response.trim();
  }

  /**
   * Formats contact data into a natural response
   * @private
   */
  _formatContactResponse(data, keywords, context) {
    if (!data || typeof data !== 'object') {
      return "You can reach Dinakaran via email or LinkedIn. Check his portfolio for contact details.";
    }

    let response = "Here's how you can get in touch with Dinakaran:\n\n";

    if (data.email) {
      response += `📧 Email: ${data.email}\n`;
    }
    
    if (data.linkedin) {
      response += `💼 LinkedIn: ${data.linkedin}\n`;
    }
    
    if (data.github) {
      response += `🐙 GitHub: ${data.github}\n`;
    }
    
    if (data.location) {
      response += `📍 Location: ${data.location}\n`;
    }

    response += "\nFeel free to reach out for collaboration or opportunities!";

    return response;
  }

  /**
   * Formats certifications data into a natural response
   * @private
   */
  _formatCertificationsResponse(data, keywords, context) {
    if (!Array.isArray(data) || data.length === 0) {
      return "Dinakaran holds certifications in Playwright automation and Python programming.";
    }

    let response = "Dinakaran holds the following certifications:\n\n";

    for (const cert of data) {
      response += `📜 **${cert.name}**\n`;
      response += `Issued by: ${cert.issuer} | Year: ${cert.year}\n`;
      
      if (cert.description) {
        response += `${cert.description}\n`;
      }
      
      response += "\n";
    }

    return response.trim();
  }

  /**
   * Formats personal/about data into a natural response
   * @private
   */
  _formatPersonalResponse(data, keywords, context) {
    if (!data || typeof data !== 'object') {
      return "Dinakaran Prabalanathan is a Quality Assurance Technician at Amazon with over 5 years of experience.";
    }

    let response = `👋 Hi! I'm here to tell you about **${data.name}**.\n\n`;
    
    if (data.role && data.company) {
      response += `Currently working as a **${data.role}** at **${data.company}**.\n\n`;
    }
    
    if (data.summary) {
      response += `${data.summary}\n\n`;
    }
    
    if (data.highlights && data.highlights.length > 0) {
      response += "Key highlights:\n";
      for (const highlight of data.highlights) {
        response += `⭐ ${highlight}\n`;
      }
    }
    
    if (data.location) {
      response += `\n📍 Based in: ${data.location}`;
    }

    return response;
  }

  /**
   * Escapes special regex characters in a string
   * @private
   * @param {string} str - String to escape
   * @returns {string} - Escaped string safe for regex
   */
  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// ES Module export
export { QueryProcessor };

// CommonJS export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QueryProcessor };
}

// Browser global
if (typeof window !== 'undefined') {
  window.QueryProcessor = QueryProcessor;
}
