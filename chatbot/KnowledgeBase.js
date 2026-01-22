/**
 * KnowledgeBase Class
 * 
 * Provides structured access to portfolio information with query capabilities.
 * Supports category-based retrieval, keyword matching, and cross-category search.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.2
 */

class KnowledgeBase {
  /**
   * Threshold for high-confidence matches that trigger early termination
   * @static
   */
  static HIGH_CONFIDENCE_THRESHOLD = 0.85;

  /**
   * Default fallback response when errors occur
   * @static
   */
  static DEFAULT_FALLBACK_RESPONSE = "I'm having trouble accessing that information right now. You can ask me about my experience, skills, projects, awards, certifications, or contact information.";

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
    if (KnowledgeBase._isDevelopmentMode()) {
      console.error(`[KnowledgeBase] ${message}`, error || '');
    }
  }

  /**
   * Initializes the KnowledgeBase with structured data
   * @param {Object} data - The structured knowledge base data
   * @param {Object} [options] - Configuration options
   * @param {number} [options.highConfidenceThreshold] - Threshold for early termination (default: 0.85)
   */
  constructor(data, options = {}) {
    if (!data || typeof data !== 'object') {
      throw new Error('KnowledgeBase requires a valid data object');
    }
    this.data = data;
    this.categories = Object.keys(data);
    this.highConfidenceThreshold = options.highConfidenceThreshold || KnowledgeBase.HIGH_CONFIDENCE_THRESHOLD;
  }

  /**
   * Returns all data for a specific category
   * @param {string} category - The category name to retrieve
   * @returns {Object|Array|null} - The data for the category, or null if not found
   */
  getByCategory(category) {
    try {
      if (!category || typeof category !== 'string') {
        return null;
      }
      
      const normalizedCategory = category.toLowerCase().trim();
      
      // Direct match
      if (this.data[normalizedCategory] !== undefined) {
        return this.data[normalizedCategory];
      }
      
      // Try to find a matching category (case-insensitive)
      const matchingKey = this.categories.find(
        key => key.toLowerCase() === normalizedCategory
      );
      
      if (matchingKey) {
        return this.data[matchingKey];
      }
      
      return null;
    } catch (error) {
      KnowledgeBase._logError('Error in getByCategory:', error);
      return null;
    }
  }

  /**
   * Retrieves information by category and keywords
   * @param {string} category - The category to search within
   * @param {string|string[]} keywords - Keywords to match
   * @returns {Array} - Array of matching data objects with relevance scores
   */
  query(category, keywords) {
    try {
      const categoryData = this.getByCategory(category);
      
      if (!categoryData) {
        return [];
      }

      // Normalize keywords to array
      const keywordArray = this._normalizeKeywords(keywords);
      
      if (keywordArray.length === 0) {
        // No keywords provided, return all category data
        return this._wrapWithRelevance(categoryData, 1.0);
      }

      // Search within the category data
      return this._searchInData(categoryData, keywordArray);
    } catch (error) {
      KnowledgeBase._logError('Error in query:', error);
      return [];
    }
  }

  /**
   * Retrieves information by category and keywords with detailed error handling
   * @param {string} category - The category to search within
   * @param {string|string[]} keywords - Keywords to match
   * @returns {Object} - Object with success status, data array, and optional fallback message
   */
  querySafe(category, keywords) {
    try {
      const categoryData = this.getByCategory(category);
      
      if (!categoryData) {
        return {
          success: false,
          data: [],
          fallback: KnowledgeBase.DEFAULT_FALLBACK_RESPONSE
        };
      }

      // Normalize keywords to array
      const keywordArray = this._normalizeKeywords(keywords);
      
      if (keywordArray.length === 0) {
        // No keywords provided, return all category data
        return {
          success: true,
          data: this._wrapWithRelevance(categoryData, 1.0)
        };
      }

      // Search within the category data
      const results = this._searchInData(categoryData, keywordArray);
      
      if (results.length === 0) {
        return {
          success: false,
          data: [],
          fallback: `I don't have specific information about that in the ${category} category. You can ask me about my experience, skills, projects, awards, certifications, or contact information.`
        };
      }
      
      return {
        success: true,
        data: results
      };
    } catch (error) {
      KnowledgeBase._logError('Error in querySafe:', error);
      return {
        success: false,
        data: [],
        fallback: KnowledgeBase.DEFAULT_FALLBACK_RESPONSE
      };
    }
  }

  /**
   * Searches across all categories for matching content
   * Optimized with early termination for high-confidence matches
   * @param {string|string[]} keywords - Keywords to search for
   * @param {Object} [options] - Search options
   * @param {boolean} [options.earlyTermination=true] - Enable early termination for high-confidence matches
   * @returns {Array} - Array of matching results with relevance scores, sorted by relevance
   * Requirements: 2.7, 6.2
   */
  search(keywords, options = {}) {
    try {
      const keywordArray = this._normalizeKeywords(keywords);
      
      if (keywordArray.length === 0) {
        return [];
      }

      const enableEarlyTermination = options.earlyTermination !== false;
      const results = [];

      // Search through all categories
      for (const category of this.categories) {
        const categoryData = this.data[category];
        const categoryResults = this._searchInDataOptimized(
          categoryData, 
          keywordArray, 
          category,
          enableEarlyTermination
        );
        results.push(...categoryResults);

        // Early termination: if we found a high-confidence match, we can stop searching
        if (enableEarlyTermination && categoryResults.length > 0) {
          const highConfidenceMatch = categoryResults.find(
            r => r.relevance >= this.highConfidenceThreshold
          );
          if (highConfidenceMatch) {
            // Add the high-confidence result and stop searching
            // Sort current results and return
            results.sort((a, b) => b.relevance - a.relevance);
            return results;
          }
        }
      }

      // Sort by relevance score (descending)
      results.sort((a, b) => b.relevance - a.relevance);

      return results;
    } catch (error) {
      KnowledgeBase._logError('Error in search:', error);
      return [];
    }
  }

  /**
   * Searches across all categories for matching content with detailed error handling
   * @param {string|string[]} keywords - Keywords to search for
   * @param {Object} [options] - Search options
   * @param {boolean} [options.earlyTermination=true] - Enable early termination for high-confidence matches
   * @returns {Object} - Object with success status, data array, and optional fallback message
   */
  searchSafe(keywords, options = {}) {
    try {
      const keywordArray = this._normalizeKeywords(keywords);
      
      if (keywordArray.length === 0) {
        return {
          success: false,
          data: [],
          fallback: "Please provide a search term. You can ask me about my experience, skills, projects, awards, certifications, or contact information."
        };
      }

      const enableEarlyTermination = options.earlyTermination !== false;
      const results = [];

      // Search through all categories
      for (const category of this.categories) {
        const categoryData = this.data[category];
        const categoryResults = this._searchInDataOptimized(
          categoryData, 
          keywordArray, 
          category,
          enableEarlyTermination
        );
        results.push(...categoryResults);

        // Early termination: if we found a high-confidence match, we can stop searching
        if (enableEarlyTermination && categoryResults.length > 0) {
          const highConfidenceMatch = categoryResults.find(
            r => r.relevance >= this.highConfidenceThreshold
          );
          if (highConfidenceMatch) {
            results.sort((a, b) => b.relevance - a.relevance);
            return {
              success: true,
              data: results
            };
          }
        }
      }

      // Sort by relevance score (descending)
      results.sort((a, b) => b.relevance - a.relevance);

      if (results.length === 0) {
        return {
          success: false,
          data: [],
          fallback: "I couldn't find information matching your query. You can ask me about my experience, skills, projects, awards, certifications, or contact information."
        };
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      KnowledgeBase._logError('Error in searchSafe:', error);
      return {
        success: false,
        data: [],
        fallback: KnowledgeBase.DEFAULT_FALLBACK_RESPONSE
      };
    }
  }

  /**
   * Optimized search within data with early termination support
   * @private
   * @param {*} data - The data to search
   * @param {string[]} keywords - Keywords to match
   * @param {string} [category] - Optional category name for results
   * @param {boolean} [enableEarlyTermination=true] - Enable early termination
   * @returns {Array} - Array of matching results with relevance scores
   */
  _searchInDataOptimized(data, keywords, category = null, enableEarlyTermination = true) {
    const results = [];

    if (Array.isArray(data)) {
      // Search through array items
      for (const item of data) {
        const relevance = this._calculateRelevance(item, keywords);
        if (relevance > 0) {
          results.push({
            data: item,
            relevance,
            category
          });
          
          // Early termination for high-confidence match
          if (enableEarlyTermination && relevance >= this.highConfidenceThreshold) {
            return results;
          }
        }
      }
    } else if (typeof data === 'object' && data !== null) {
      // For objects, check if the whole object matches or search nested structures
      const relevance = this._calculateRelevance(data, keywords);
      if (relevance > 0) {
        results.push({
          data,
          relevance,
          category
        });
        
        // Early termination for high-confidence match
        if (enableEarlyTermination && relevance >= this.highConfidenceThreshold) {
          return results;
        }
      }
      
      // Also search nested arrays within the object
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key])) {
          for (const item of data[key]) {
            const itemRelevance = this._calculateRelevance(item, keywords);
            if (itemRelevance > 0) {
              results.push({
                data: item,
                relevance: itemRelevance,
                category,
                field: key
              });
              
              // Early termination for high-confidence match
              if (enableEarlyTermination && itemRelevance >= this.highConfidenceThreshold) {
                return results;
              }
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Returns all available categories
   * @returns {string[]} - Array of category names
   */
  getAllCategories() {
    return [...this.categories];
  }

  /**
   * Normalizes keywords input to an array of lowercase strings
   * @private
   * @param {string|string[]} keywords - Keywords input
   * @returns {string[]} - Normalized array of keywords
   */
  _normalizeKeywords(keywords) {
    if (!keywords) {
      return [];
    }

    if (typeof keywords === 'string') {
      // Split string by spaces and common delimiters, filter empty strings
      return keywords
        .toLowerCase()
        .split(/[\s,;]+/)
        .map(k => k.trim())
        .filter(k => k.length > 0);
    }

    if (Array.isArray(keywords)) {
      return keywords
        .filter(k => typeof k === 'string')
        .map(k => k.toLowerCase().trim())
        .filter(k => k.length > 0);
    }

    return [];
  }

  /**
   * Wraps data with relevance score for consistent return format
   * @private
   * @param {*} data - The data to wrap
   * @param {number} relevance - The relevance score
   * @param {string} [category] - Optional category name
   * @returns {Array} - Array of objects with data and relevance
   */
  _wrapWithRelevance(data, relevance, category = null) {
    if (Array.isArray(data)) {
      return data.map(item => ({
        data: item,
        relevance,
        category
      }));
    }
    
    return [{
      data,
      relevance,
      category
    }];
  }

  /**
   * Searches within data for keyword matches
   * @private
   * @param {*} data - The data to search
   * @param {string[]} keywords - Keywords to match
   * @param {string} [category] - Optional category name for results
   * @returns {Array} - Array of matching results with relevance scores
   */
  _searchInData(data, keywords, category = null) {
    const results = [];

    if (Array.isArray(data)) {
      // Search through array items
      for (const item of data) {
        const relevance = this._calculateRelevance(item, keywords);
        if (relevance > 0) {
          results.push({
            data: item,
            relevance,
            category
          });
        }
      }
    } else if (typeof data === 'object' && data !== null) {
      // For objects, check if the whole object matches or search nested structures
      const relevance = this._calculateRelevance(data, keywords);
      if (relevance > 0) {
        results.push({
          data,
          relevance,
          category
        });
      }
      
      // Also search nested arrays within the object
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key])) {
          for (const item of data[key]) {
            const itemRelevance = this._calculateRelevance(item, keywords);
            if (itemRelevance > 0) {
              results.push({
                data: item,
                relevance: itemRelevance,
                category,
                field: key
              });
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Calculates relevance score for a data item based on keyword matches
   * @private
   * @param {*} item - The item to score
   * @param {string[]} keywords - Keywords to match
   * @returns {number} - Relevance score between 0 and 1
   */
  _calculateRelevance(item, keywords) {
    if (!item || keywords.length === 0) {
      return 0;
    }

    // Convert item to searchable text
    const searchText = this._itemToSearchText(item).toLowerCase();
    
    if (!searchText) {
      return 0;
    }

    let matchCount = 0;
    let totalWeight = 0;

    for (const keyword of keywords) {
      // Skip very short keywords (less than 2 chars) to avoid noise
      if (keyword.length < 2) {
        continue;
      }

      totalWeight++;
      
      // Check for exact word match (higher weight)
      const wordBoundaryRegex = new RegExp(`\\b${this._escapeRegex(keyword)}\\b`, 'i');
      if (wordBoundaryRegex.test(searchText)) {
        matchCount += 1;
      }
      // Check for partial match (lower weight)
      else if (searchText.includes(keyword)) {
        matchCount += 0.5;
      }
    }

    if (totalWeight === 0) {
      return 0;
    }

    return matchCount / totalWeight;
  }

  /**
   * Converts an item to searchable text
   * @private
   * @param {*} item - The item to convert
   * @returns {string} - Searchable text representation
   */
  _itemToSearchText(item) {
    if (typeof item === 'string') {
      return item;
    }

    if (typeof item === 'number' || typeof item === 'boolean') {
      return String(item);
    }

    if (Array.isArray(item)) {
      return item.map(i => this._itemToSearchText(i)).join(' ');
    }

    if (typeof item === 'object' && item !== null) {
      const textParts = [];
      for (const value of Object.values(item)) {
        textParts.push(this._itemToSearchText(value));
      }
      return textParts.join(' ');
    }

    return '';
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
export { KnowledgeBase };

// CommonJS export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KnowledgeBase };
}

// Browser global
if (typeof window !== 'undefined') {
  window.KnowledgeBase = KnowledgeBase;
}
