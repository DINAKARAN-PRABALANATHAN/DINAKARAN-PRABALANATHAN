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
    'Automatic Test Re-runner Script': {
        description: 'A comprehensive automation solution that monitors test results and automatically re-runs failed tests. The system operates 24/7, ensuring maximum test coverage and reducing manual intervention.',
        features: [
            'Automated monitoring of test execution results',
            'Intelligent retry logic with configurable parameters',
            '24/7 automated processing without manual intervention',
            'Integration with REST API for seamless workflow',
            'Detailed logging and reporting capabilities'
        ],
        impact: '$4,838',
        impactLabel: 'saved annually'
    },
    'Automatic Rule Trigger Tool': {
        description: 'Streamlined MTS/DTS Automation tool that automates daily rule triggering across multiple device pools, eliminating repetitive manual tasks.',
        features: [
            'Automated daily rule triggering',
            'Multi-device pool support',
            'Cloud Desktop integration',
            'Scheduled execution capabilities',
            'Error handling and notifications'
        ],
        impact: '0.5 hrs/day',
        impactLabel: 'time saved'
    },
    'Kill Switch Mechanism': {
        description: 'Python-based automation tool designed to quickly cancel pending tasks during build deliveries, preventing resource waste and improving deployment efficiency.',
        features: [
            'Rapid task cancellation capability',
            'REST API integration',
            'Build delivery optimization',
            'Resource management improvements',
            'Emergency stop functionality'
        ],
        impact: '35.98 hrs',
        impactLabel: 'saved annually'
    },
    'VLS Functionality Testing Framework': {
        description: 'Comprehensive test framework for Headless and Multi-modal devices with standardized testing processes ensuring consistent quality across all device types.',
        features: [
            'Comprehensive test plans for multiple device types',
            'Standardized testing processes',
            'Pytest integration',
            'Headless device support',
            'Multi-modal device testing'
        ],
        impact: '100%',
        impactLabel: 'coverage'
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
