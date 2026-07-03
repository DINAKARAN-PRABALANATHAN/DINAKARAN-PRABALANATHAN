/**
 * Knowledge Base for Dinakaran Prabalanathan's Portfolio Chatbot
 * 
 * This module contains all structured data about Dinakaran's professional background,
 * extracted from the portfolio website content.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8
 */

const knowledgeBase = {
  // Personal Information (Requirement 8.1 - About section)
  personal: {
    name: "Dinakaran Prabalanathan",
    role: "Software Engineer II in Test (SE2)",
    company: "Amazon",
    location: "Tirupur, Tamil Nadu, India (Currently in Chennai)",
    yearsOfExperience: "5+",
    summary: "Software Engineer II in Test (SE2) with over 5 years of professional experience specializing in Python-based automation frameworks, developer tools, and comprehensive test support for engineering teams at Amazon. Expert in collaborating with developers to establish requirements, debug intricate system failures, and build innovative engineering tools including REST API integrations and Agentic AI-powered diagnostics.",
    highlights: [
      "Engineered AI-powered MCP toolkit with 6 modular servers and 178 tools",
      "Reduced test analysis cycles from 30-50 minutes to 3-5 minutes",
      "Authored 200+ automated test cases across firmware, device setups, and media frameworks",
      "Built a 24/7 Python automation engine for intelligent test reruns",
      "85 code reviews authored, 53 reviewed",
      "Innovation Awards recipient at Amazon",
      "Excellence in Leadership Award from WERP-India"
    ]
  },

  // Experience Timeline (Requirement 8.2 - 2019 to present)
  experience: [
    {
      title: "Software Engineer II in Test (SE2) — Test & Developer Support",
      company: "Amazon",
      duration: "Jul 2026 - Present",
      location: "Chennai, India",
      responsibilities: [
        "Delivering dedicated technical test support to the core development team",
        "Collaborating with developers and project leads to establish testing requirements and define risk-mitigation strategies",
        "Reviewing and optimizing automated test infrastructure using Python",
        "Collaborated closely with firmware developers, core network groups, and project leads",
        "Authored 85 code reviews, 53 reviewed"
      ],
      technologies: ["Python", "PyTest", "Code Reviews", "Developer Support"]
    },
    {
      title: "Quality Assurance Technician",
      company: "Amazon",
      duration: "Apr 2024 - Jul 2026",
      location: "Chennai, India",
      responsibilities: [
        "Designed, developed, and executed comprehensive automated test scripts and frameworks using Python, pytest, and tox",
        "Authored over 200+ automated test cases spanning firmware updates, device setups, sensor streaming, and media frameworks",
        "Managed daily execution and validation of 200+ automated test suites per build cycle",
        "Built a 24/7 Python automation engine that polls build systems, fetches test results via REST APIs, isolates failures, and triggers intelligent reruns",
        "Identified and tracked over 200 critical software defects with detailed root-cause log analysis",
        "Engineered an AI-powered QA toolkit utilizing MCP with 6 modular servers and 178 tools, reducing analysis from 30-50 min to 3-5 min"
      ],
      technologies: ["Python", "PyTest", "Playwright", "tox", "REST API", "MCP", "Agentic AI"]
    },
    {
      title: "Device Associate",
      company: "Amazon",
      duration: "May 2021 - Apr 2024",
      location: "Chennai, India",
      responsibilities: [
        "Conducted structured manual testing for functional, regression, and integration phases on embedded Linux and Android hardware devices",
        "Authored Python script to automate daily hardware health checks across 2 labs and 200+ target devices",
        "Developed a Branch Comparator tool to analyze test suite alignments across Mainline and Release builds"
      ],
      technologies: ["Python", "Linux", "Android", "Jira", "Manual Testing"]
    },
    {
      title: "Assistant National Director (Intern)",
      company: "WERP-India",
      duration: "Apr 2019 - Oct 2022",
      location: "India",
      responsibilities: [
        "Led national-level initiatives and coordinated cross-functional teams",
        "Earned the Excellence in Leadership Award for outstanding contributions",
        "Contributed to organizational growth and team development"
      ],
      technologies: ["Leadership", "Management", "Team Coordination"]
    }
  ],

  // Skills and Technologies (Requirement 8.3)
  skills: {
    automation: ["PyTest (Fixtures, Parametrization, Custom Assertions)", "Playwright (Python & JavaScript)", "Selenium", "tox", "pexpect"],
    programming: ["Python (5+ years)", "Bash Scripting", "JavaScript"],
    testing: [
      "Functional Testing",
      "Regression Testing",
      "Integration Testing",
      "Performance Testing",
      "Smoke Testing",
      "Sanity Testing",
      "Manual Testing",
      "Embedded Linux & Android Testing",
      "REST API Testing"
    ],
    methodologies: [
      "Agile/Scrum",
      "Software Development Life Cycle (SDLC)",
      "Full-lifecycle QA",
      "Developer Test Support",
      "Root Cause Analysis",
      "Log Analysis (journalctl)"
    ],
    cloud: ["AWS CDK", "Dual-pipeline Deployments (Beta/Prod)"],
    tools: ["Git", "JIRA", "TestRail", "Postman", "adb (Android/Linux testing)"],
    frameworks: ["PyTest", "Playwright", "Selenium", "tox"],
    ai: ["Agentic AI QA toolkits", "Model Context Protocol (MCP)", "REST API integrations", "JSON/CSV Data Pipelines"]
  },

  // Projects with descriptions and metrics (Requirement 8.5)
  projects: [
    {
      name: "AI-Powered QA Toolkit (MCP)",
      description: "Engineered an AI-powered QA toolkit utilizing Model Context Protocol with 6 modular servers and 178 tools inside the IDE, enabling autonomous failure triage, root cause analysis, automated re-runs, and Jira/TestRail updates.",
      technologies: ["MCP", "Agentic AI", "Python", "REST API"],
      impact: "90% reduction in analysis time (30-50 min to 3-5 min)",
      metrics: {
        timeSaved: "90%",
        tools: "178",
        servers: "6"
      }
    },
    {
      name: "24/7 Automated Rerun Engine",
      description: "Built a Python automation engine that polls build systems, fetches test results via REST APIs, isolates failures, and triggers intelligent reruns without human intervention.",
      technologies: ["Python", "REST API", "Automation"],
      impact: "Hundreds of hours saved monthly",
      metrics: {
        timeSaved: "100s hours",
        period: "monthly"
      }
    },
    {
      name: "Device Health Check & Jira Automation",
      description: "Automated daily hardware health checks across 2 labs and 200+ target devices, cutting evaluation hours to minutes with auto-generated Jira tickets for failures.",
      technologies: ["Python", "Jira API"],
      impact: "200+ devices monitored",
      metrics: {
        devicesMonitored: "200+",
        labs: "2"
      }
    },
    {
      name: "Branch Comparator Tool",
      description: "Analyzes test suite alignments across Mainline and Release builds, reducing missing test modules during deployment readiness phases.",
      technologies: ["Python", "Comparison Tool"],
      impact: "100% coverage tracking",
      metrics: {
        coverage: "100%"
      }
    }
  ],

  // Awards with dates and organizations (Requirement 8.6)
  awards: [
    {
      title: "2x Innovation Awards",
      organization: "Amazon",
      year: "2023-2024",
      description: "Recognized for developing innovative testing solutions that improved efficiency and saved resources."
    },
    {
      title: "3x Spot Awards",
      organization: "Amazon",
      year: "2021-2024",
      description: "Awarded for quality excellence and outstanding performance in testing activities."
    },
    {
      title: "Excellence in Leadership",
      organization: "WERP-India",
      year: 2019,
      description: "Awarded for outstanding leadership as Assistant National Director."
    }
  ],

  // Certifications with details (Requirement 8.4)
  certifications: [
    {
      name: "Playwright Python Automation Testing",
      issuer: "From Zero to Expert",
      year: 2024,
      description: "Comprehensive Playwright automation testing with Python from fundamentals to advanced techniques."
    },
    {
      name: "Python for Automation",
      issuer: "Online Certification",
      year: 2021,
      description: "Advanced Python programming for test automation and scripting."
    }
  ],

  // Contact information and social links (Requirement 8.7)
  contact: {
    email: "dinakaranprabalanathan@gmail.com",
    phone: "+91-7708087946",
    linkedin: "https://linkedin.com/in/dinakaran-p",
    github: "https://github.com/DINAKARAN-PRABALANATHAN",
    location: "Tirupur, Tamil Nadu, India (Currently in Chennai)",
    resumeAvailable: true
  },

  // Testimonials
  testimonials: [
    {
      quote: "Dinakaran's automation solutions have significantly improved our testing efficiency. His innovative approach to problem-solving is remarkable.",
      author: "Team Lead",
      organization: "Amazon"
    },
    {
      quote: "A dedicated professional who consistently delivers high-quality work. His expertise in Playwright and Python automation is exceptional.",
      author: "Senior Manager",
      organization: "Amazon"
    },
    {
      quote: "His leadership skills and ability to coordinate teams made a significant impact during his tenure. A true asset to any organization.",
      author: "National Director",
      organization: "WERP-India"
    }
  ],

  // Quick facts for common queries
  quickFacts: {
    currentRole: "Software Engineer II in Test (SE2) at Amazon",
    totalExperience: "5+ years",
    specialization: "Python-based automation frameworks, developer tools, and AI-powered diagnostics",
    location: "Tirupur, Tamil Nadu, India (Currently in Chennai)",
    keyAchievement: "Engineered AI-powered MCP toolkit with 178 tools reducing analysis from 30-50 min to 3-5 min",
    codeReviews: "85 authored, 53 reviewed",
    automatedTestCases: "200+",
    mcpTools: "178 tools across 6 modular servers"
  }
};

// Export the knowledge base for use in other modules
// ES Module export (for modern JavaScript environments)
export { knowledgeBase };

// CommonJS export (for Node.js compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { knowledgeBase };
}

// Also make it available as a global for browser usage
if (typeof window !== 'undefined') {
  window.knowledgeBase = knowledgeBase;
}
