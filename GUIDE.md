# Portfolio Website - Complete Guide

A comprehensive guide for maintaining and updating this portfolio website.

---

## Project Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling (responsive included)
├── script.js       # JavaScript functionality
├── Photos/         # Image assets
├── README.md       # Project overview
└── GUIDE.md        # This file
```

---

## Quick Reference

### Colors (CSS Variables in `:root`)

| Variable          | Value     | Usage                    |
|-------------------|-----------|--------------------------|
| `--primary`       | #6366f1   | Primary brand color      |
| `--primary-light` | #818cf8   | Highlights, links        |
| `--black`         | #0a0a0a   | Main background          |
| `--dark`          | #111111   | Section backgrounds      |
| `--dark-gray`     | #1a1a1a   | Cards background         |
| `--medium-gray`   | #2a2a2a   | Borders                  |
| `--light-gray`    | #888888   | Secondary text           |
| `--white`         | #ffffff   | Primary text             |
| `--accent`        | #22c55e   | Success/impact numbers   |

### Breakpoints

| Width      | Target          |
|------------|-----------------|
| ≤ 968px    | Tablet/Mobile   |

---

## How to Update Content

### 1. Update Personal Info

**File:** `index.html`

```html
<!-- Hero Section -->
<p class="hero-intro">I'm [YOUR NAME], [YOUR TAGLINE].</p>

<!-- Contact Section -->
<a href="mailto:[YOUR EMAIL]" class="contact-btn primary">Get in Touch</a>
<p class="location">📍 [YOUR LOCATION]</p>
```

### 2. Update Profile Photo

1. Add your image to `Photos/` folder
2. Update the `src` in `index.html`:

```html
<img src="Photos/[YOUR-IMAGE-FILENAME].png" alt="[Your Name]">
```

### 3. Add/Edit Skills

**File:** `index.html` - Find `.marquee-content`

```html
<span class="skill-tag">New Skill</span>
```

Note: Skills are duplicated for seamless marquee animation.

### 4. Add a New Project

**File:** `index.html` - Find `.projects-grid`

```html
<div class="project-card">
    <div class="project-tags">
        <span>Tag1</span>
        <span>Tag2</span>
    </div>
    <h3>Project Title</h3>
    <p>Project description goes here.</p>
    <div class="project-impact">
        <span class="impact-value">$X,XXX</span>
        <span class="impact-label">metric label</span>
    </div>
</div>
```

For featured (full-width) project, add class `featured`:
```html
<div class="project-card featured">
```

### 5. Update Rotating Roles

**File:** `script.js`

```javascript
const roles = [
    'Role 1',
    'Role 2',
    'Role 3'
];
```

### 6. Change GitHub Username

**File:** `script.js`

```javascript
const username = 'YOUR-GITHUB-USERNAME';
```

### 7. Update Stats

**File:** `index.html` - Find `.stats-grid`

```html
<div class="stat-item">
    <span class="stat-number">X+</span>
    <span class="stat-label">Label</span>
</div>
```

### 8. Update Experience Timeline

**File:** `index.html` - Find `.timeline`

```html
<div class="timeline-item">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
        <span class="timeline-date">Apr 2024 - Present</span>
        <h3>Job Title</h3>
        <h4>Company Name</h4>
        <p>Description of your role and achievements.</p>
        <div class="timeline-tags">
            <span>Skill1</span>
            <span>Skill2</span>
        </div>
    </div>
</div>
```

### 9. Update Certifications & Awards

**File:** `index.html` - Find `.certs-grid`

```html
<div class="cert-card award">  <!-- Use "award" or "cert" class -->
    <div class="cert-icon">🏆</div>
    <h3>Award/Certification Name</h3>
    <p class="cert-issuer">Issuing Organization</p>
    <p class="cert-desc">Description of the achievement.</p>
    <span class="cert-year">2024</span>
</div>
```

### 10. Update Testimonials

**File:** `index.html` - Find `.testimonials-grid`

```html
<div class="testimonial-card">
    <div class="testimonial-content">
        <p>"Quote from the person about working with you."</p>
    </div>
    <div class="testimonial-author">
        <div class="author-avatar">AB</div>  <!-- Initials -->
        <div class="author-info">
            <h4>Person's Title</h4>
            <p>Company</p>
        </div>
    </div>
</div>
```

### 11. Update Project Modal Details

**File:** `script.js` - Find `projectData` object

```javascript
'Project Title': {
    description: 'Full project description...',
    features: [
        'Feature 1',
        'Feature 2',
        'Feature 3'
    ],
    impact: '$X,XXX',
    impactLabel: 'saved annually'
}
```

### 12. Toggle Dark/Light Mode

The theme toggle button is in the navbar. User preference is saved to localStorage.

To set default theme, modify in `script.js`:
```javascript
// Force dark mode by default
setTheme(true);

// Force light mode by default  
setTheme(false);
```

---

## Adding New Sections

### Template for a New Section

**HTML:**
```html
<section id="new-section" class="new-section">
    <div class="container">
        <div class="section-header">
            <h2>Section Title</h2>
            <p class="section-subtitle">Optional subtitle</p>
        </div>
        <!-- Your content here -->
    </div>
</section>
```

**CSS:**
```css
.new-section {
    padding: 100px 24px;
    background: var(--black); /* or var(--dark) for alternating */
}
```

**Navigation Link:**
```html
<li><a href="#new-section">New Section</a></li>
```

---

## Styling Guide

### Card Component

```css
.your-card {
    background: var(--dark-gray);
    padding: 32px;
    border-radius: 16px;
    border: 1px solid var(--medium-gray);
    transition: all 0.3s;
}

.your-card:hover {
    border-color: var(--primary);
    transform: translateY(-4px);
}
```

### Button Styles

```css
/* Primary Button */
.btn-primary {
    background: var(--white);
    color: var(--black);
    padding: 16px 32px;
    border-radius: 10px;
    font-weight: 600;
}

/* Secondary Button */
.btn-secondary {
    background: transparent;
    color: var(--white);
    border: 2px solid var(--medium-gray);
    padding: 16px 32px;
    border-radius: 10px;
}
```

### Tag/Badge

```css
.tag {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--primary-light);
    background: rgba(99, 102, 241, 0.15);
    padding: 6px 12px;
    border-radius: 6px;
}
```

---

## Mobile Responsiveness

The hamburger menu activates at 968px. To adjust:

**File:** `styles.css`

```css
@media (max-width: 968px) {
    /* Mobile styles here */
}
```

### Testing Mobile

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device or resize

---

## Deployment

### Cloudflare Pages (Current)

1. Push changes to GitHub
2. Cloudflare auto-deploys from connected repo
3. Live at: `https://[project-name].pages.dev`

### Manual Redeploy

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → Your project
3. Click "Retry deployment" or push new commit

### Custom Domain

1. Cloudflare Dashboard → Your project → Custom domains
2. Add domain → Follow DNS instructions

---

## Common Tasks

### Add Social Media Links

```html
<div class="contact-links">
    <a href="https://linkedin.com/in/YOUR-PROFILE" target="_blank" class="contact-btn secondary">LinkedIn</a>
    <a href="https://twitter.com/YOUR-HANDLE" target="_blank" class="contact-btn secondary">Twitter</a>
    <a href="https://github.com/YOUR-USERNAME" target="_blank" class="contact-btn secondary">GitHub</a>
</div>
```

### Add Resume/CV Download

```html
<a href="path/to/resume.pdf" download class="contact-btn primary">Download Resume</a>
```

### Add Google Analytics

Add before `</head>` in `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Add Favicon

1. Add `favicon.ico` to root folder
2. Add in `<head>`:
```html
<link rel="icon" href="favicon.ico" type="image/x-icon">
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Hamburger menu not visible | Check CSS order, ensure `!important` on mobile styles |
| GitHub repos not loading | Check username in `script.js`, verify API rate limits |
| Animations not working | Check if JavaScript is loaded, look for console errors |
| Styles not updating | Hard refresh (Ctrl+Shift+R), clear cache |
| Mobile layout broken | Check media query breakpoint, test in DevTools |

---

## Future Enhancements Ideas

- [ ] Blog section
- [ ] Contact form with backend
- [ ] Multi-language support

## Completed Features

- [x] Social media links (GitHub, LinkedIn, Email icons)
- [x] Resume download button
- [x] Google Analytics
- [x] Favicon support
- [x] SEO meta tags
- [x] Open Graph tags for social sharing
- [x] Mobile hamburger menu
- [x] Dark/Light mode toggle
- [x] Project detail pages (modal popups)
- [x] Testimonials section
- [x] Certifications/Awards section
- [x] Timeline/Experience section

---

## Resources

- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

*Last updated: January 2026*
