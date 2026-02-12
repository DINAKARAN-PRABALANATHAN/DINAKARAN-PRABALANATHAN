// Rotating roles animation
const roles = [
    'Python Automation Specialist',
    'Playwright & Pytest Expert',
    'Mobile Testing Engineer',
    'Web Application Tester',
    'REST API Specialist'
];

let currentRoleIndex = 0;
const roleElement = document.getElementById('rotating-role');

function rotateRole() {
    roleElement.style.opacity = '0';
    roleElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        roleElement.textContent = roles[currentRoleIndex];
        roleElement.style.opacity = '1';
        roleElement.style.transform = 'translateY(0)';
    }, 300);
}

if (roleElement) {
    roleElement.style.transition = 'opacity 0.3s, transform 0.3s';
    setInterval(rotateRole, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.expertise-card, .project-card, .stat-item, .expertise-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Add visible class styles
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// Fetch GitHub repositories
async function fetchGitHubRepos() {
    const username = 'DINAKARAN-PRABALANATHAN';
    const container = document.getElementById('repos-container');
    
    if (!container) return;
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        if (!repos.length || repos.message) {
            container.innerHTML = '<p class="loading">No repositories found.</p>';
            return;
        }
        
        const reposHTML = repos
            .filter(repo => !repo.fork)
            .slice(0, 6)
            .map(repo => `
                <a href="${repo.html_url}" target="_blank" class="repo-card">
                    <div class="repo-header">
                        <h3>${repo.name}</h3>
                        ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                    </div>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="repo-stats">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                    </div>
                </a>
            `).join('');
        
        container.innerHTML = reposHTML || '<p class="loading">No repositories found.</p>';
    } catch (error) {
        container.innerHTML = '<p class="loading">Failed to load repositories.</p>';
        console.error('Error fetching repos:', error);
    }
}

fetchGitHubRepos();

// Mobile hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Theme Toggle (Dark/Light Mode)
const themeToggle = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    if (isDark) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Check saved preference or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    setTheme(false);
} else if (savedTheme === 'dark') {
    setTheme(true);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isCurrentlyDark = !document.body.classList.contains('light-mode');
        setTheme(!isCurrentlyDark);
    });
}

// Project Modal
const projectData = {
    'MCP-based Failure Triage System': {
        description: 'An autonomous failure triage and recovery system built on MCP Server/Client architecture, integrated with an AI chatbot and REST API tools. Completely eliminates daily manual triage activities.',
        features: [
            'AI-powered failure analysis and root cause categorization',
            'Automated re-runs triggered based on failure patterns',
            'Jira and TestRail automatic updates',
            'Safe code validation in isolated directories',
            'Email/Slack notifications to owners',
            'MCP Server/Client architecture for extensibility'
        ],
        impact: '100%',
        impactLabel: 'manual triage eliminated'
    },
    'Automated Test Re-runner System': {
        description: 'A comprehensive automation solution using Python and REST APIs that reruns failed test suites during idle time, maximizing device utilization and improving test coverage.',
        features: [
            'Automated monitoring of test execution results',
            'Intelligent retry logic during idle time',
            'REST API integration for seamless workflow',
            'Improved device utilization',
            'Detailed logging and reporting capabilities'
        ],
        impact: '100s hrs',
        impactLabel: 'saved monthly'
    },
    'Device Health Check & Jira Automation': {
        description: 'Automated health check system across 200+ devices with automatic Jira ticket creation for failures, drastically reducing manual monitoring effort.',
        features: [
            'Automated health checks across 200+ devices',
            'Automatic Jira ticket creation for failures',
            'Real-time device status monitoring',
            'Reduced manual effort drastically',
            'Integration with device lab infrastructure'
        ],
        impact: '200+',
        impactLabel: 'devices monitored'
    },
    'Test Suite Comparator Tool': {
        description: 'Tool to identify missing test modules across builds and branches, ensuring complete test coverage and preventing gaps in testing.',
        features: [
            'Cross-build test module comparison',
            'Branch-level test coverage analysis',
            'Missing module identification',
            'Coverage gap reporting',
            'Build validation support'
        ],
        impact: '100%',
        impactLabel: 'coverage tracking'
    }
};

// Create modal element
const modalHTML = `
<div class="modal-overlay" id="projectModal">
    <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-body">
            <div class="project-tags" id="modalTags"></div>
            <h2 id="modalTitle"></h2>
            <p class="description" id="modalDescription"></p>
            <h3>Key Features</h3>
            <ul id="modalFeatures"></ul>
            <div class="modal-impact">
                <div class="project-impact">
                    <span class="impact-value" id="modalImpactValue"></span>
                    <span class="impact-label" id="modalImpactLabel"></span>
                </div>
            </div>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal = document.getElementById('projectModal');
const modalClose = modal.querySelector('.modal-close');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        const data = projectData[title];
        
        if (data) {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDescription').textContent = data.description;
            document.getElementById('modalTags').innerHTML = card.querySelector('.project-tags').innerHTML;
            document.getElementById('modalFeatures').innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
            document.getElementById('modalImpactValue').textContent = data.impact;
            document.getElementById('modalImpactLabel').textContent = data.impactLabel;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});
