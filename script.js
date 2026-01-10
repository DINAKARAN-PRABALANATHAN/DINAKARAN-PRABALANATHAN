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
