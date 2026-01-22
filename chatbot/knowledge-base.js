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
    role: "Quality Assurance Technician",
    company: "Amazon",
    location: "Coimbatore, Tamil Nadu, India (Currently in Chennai)",
    yearsOfExperience: "5+",
    summary: "Quality Assurance Technician with over 5 years of experience in manual and automation testing. Expertise spans Playwright, Selenium, Pytest, Python, and JavaScript, with a focus on mobile and web application testing using BDD methodologies.",
    highlights: [
      "Innovation Award recipient at Amazon for developing innovative testing solutions",
      "Excellence in Leadership Award from WERP-India",
      "Saved $5K+ annually through automation improvements"
    ]
  },

  // Experience Timeline (Requirement 8.2 - 2019 to present)
  experience: [
    {
      title: "Quality Assurance Technician",
      company: "Amazon",
      duration: "Apr 2024 - Present",
      location: "Chennai, Tamil Nadu, India",
      responsibilities: [
        "Leading automation testing initiatives using Playwright, Selenium, and Pytest",
        "Developed innovative testing solutions recognized with the Innovation Award",
        "Saved $5K+ annually through automation improvements",
        "Building robust test frameworks to ensure consistent quality at scale"
      ],
      technologies: ["Playwright", "Python", "Selenium", "Pytest"]
    },
    {
      title: "Device Associate",
      company: "Amazon",
      duration: "May 2021 - Apr 2024",
      location: "Chennai, Tamil Nadu, India",
      responsibilities: [
        "Worked on device testing and quality assurance processes",
        "Gained hands-on experience with mobile and web application testing",
        "Applied BDD methodologies for comprehensive test coverage"
      ],
      technologies: ["Device Testing", "BDD", "Manual Testing"]
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
    automation: ["Playwright", "Selenium", "Pytest", "Python Automation"],
    programming: ["Python", "JavaScript"],
    testing: [
      "Automation Testing",
      "Manual Testing",
      "Mobile Testing",
      "Web Application Testing",
      "Performance Testing",
      "Integration Testing",
      "BDD (Behavior Driven Development)",
      "REST API Testing"
    ],
    methodologies: [
      "Software Testing Life Cycle (STLC)",
      "Equivalence Class Partitioning",
      "Boundary Value Testing",
      "State Transition Testing"
    ],
    cloud: ["AWS"],
    tools: ["Git", "JIRA", "Flask"],
    frameworks: ["Pytest", "Playwright", "Selenium"]
  },

  // Projects with descriptions and metrics (Requirement 8.5)
  projects: [
    {
      name: "Automatic Test Re-runner Script",
      description: "Automated test rerun processes with 24/7 automated processing for improved testing efficiency and resource utilization.",
      technologies: ["Python", "REST API", "Automation"],
      impact: "$4,838 saved annually",
      metrics: {
        costSavings: "$4,838",
        period: "annually"
      }
    },
    {
      name: "Automatic Rule Trigger Tool",
      description: "Streamlined MTS/DTS Automation by automating daily rule triggering across device pools.",
      technologies: ["Python", "Cloud Desktop"],
      impact: "0.5 hrs/day time saved",
      metrics: {
        timeSaved: "0.5 hours",
        period: "daily"
      }
    },
    {
      name: "Kill Switch Mechanism",
      description: "Python-based automation tool for cancelling pending tasks during build deliveries.",
      technologies: ["Python", "REST API"],
      impact: "35.98 hrs saved annually",
      metrics: {
        timeSaved: "35.98 hours",
        period: "annually"
      }
    },
    {
      name: "VLS Functionality Testing Framework",
      description: "Comprehensive test plans for Headless and Multi-modal devices with standardized testing processes.",
      technologies: ["Pytest", "Test Framework"],
      impact: "100% coverage",
      metrics: {
        coverage: "100%"
      }
    }
  ],

  // Awards with dates and organizations (Requirement 8.6)
  awards: [
    {
      title: "Innovation Award",
      organization: "Amazon",
      year: 2023,
      description: "Recognized for developing innovative testing solutions that improved efficiency and saved resources."
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
    linkedin: "https://linkedin.com/in/dinakaran-p",
    github: "https://github.com/DINAKARAN-PRABALANATHAN",
    location: "Coimbatore, Tamil Nadu, India (Currently in Chennai)",
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
    currentRole: "Quality Assurance Technician at Amazon",
    totalExperience: "5+ years",
    specialization: "Automation Testing with Playwright, Selenium, and Python",
    location: "Coimbatore, Tamil Nadu, India (Currently in Chennai)",
    keyAchievement: "Innovation Award at Amazon for developing innovative testing solutions",
    annualSavings: "$5K+ through automation improvements"
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
