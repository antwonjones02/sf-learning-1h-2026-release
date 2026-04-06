const fs = require('fs');
const path = require('path');
const features = require('../deck/features.js');

// Helper: convert feature name to kebab-case slug
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Build flat ordered list of all features with category info
const categories = [
  { key: 'universal', label: 'Universal', sublabel: 'Automatically On', color: '#1B7340', cssClass: 'universal' },
  { key: 'optIn', label: 'Opt-In', sublabel: 'Customer Configured', color: '#2070B0', cssClass: 'optin' },
  { key: 'premium', label: 'Premium', sublabel: 'Restricted / Licensed', color: '#D4760A', cssClass: 'premium' },
  { key: 'deprecation', label: 'Deprecation', sublabel: 'End of Life', color: '#CC0033', cssClass: 'deprecation' },
];

const allFeatures = [];
categories.forEach(cat => {
  const items = features[cat.key] || [];
  items.forEach(f => {
    allFeatures.push({ ...f, category: cat });
  });
});

// Assign slugs
allFeatures.forEach(f => {
  f.slug = toSlug(f.name);
});

// Escape HTML
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Determine recommendation badge class
function recBadgeClass(rec) {
  const r = (rec || '').toLowerCase();
  if (r.includes('migrate') || r.includes('now') || r.includes('prepare')) return 'critical';
  if (r.includes('update') || r.includes('evaluate') || r.includes('contact') || r.includes('plan')) return 'warn';
  return '';
}

// Determine impact badge class
function impactClass(impact) {
  const i = (impact || '').toLowerCase();
  if (i === 'critical') return 'critical';
  if (i === 'major') return 'major';
  return '';
}

// Arrow SVG
const arrowLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>`;

// Common header
function header(pathPrefix) {
  return `<header class="site-header">
    <div class="header-inner">
      <a href="${pathPrefix}index.html" style="color:inherit;text-decoration:none">
        <div class="header-title">SAP SuccessFactors Learning <span>| 1H 2026 Release Strategy</span></div>
      </a>
      <div class="header-badge">1H 2026</div>
    </div>
  </header>`;
}

// Common footer
function footer() {
  return `<footer class="site-footer">
    SAP SuccessFactors Learning &middot; 1H 2026 Release Strategy &middot; Internal Use Only
  </footer>`;
}

// ==================== INDEX PAGE ====================

function buildIndex() {
  const featureCards = (items, catKey) => {
    return items.map(f => {
      const rc = recBadgeClass(f.recommendation);
      const ic = impactClass(f.majorMinor);
      return `<a href="features/${f.slug}.html" class="feature-card" data-cat="${catKey}" data-name="${esc(f.name.toLowerCase())}">
        <div class="feature-name">${esc(f.name)}</div>
        <div class="feature-meta">
          <span class="badge badge-rec ${rc}">${esc(f.recommendation)}</span>
          <span class="badge badge-type">${esc(f.type)}</span>
          <span class="badge badge-impact ${ic}">${esc(f.majorMinor)}</span>
        </div>
      </a>`;
    }).join('\n      ');
  };

  const categorySections = categories.map(cat => {
    const items = allFeatures.filter(f => f.category.key === cat.key);
    return `<section class="category-section" data-category="${cat.cssClass}">
      <div class="category-header">
        <div class="category-dot" style="background:${cat.color}"></div>
        <h2>${esc(cat.label)}</h2>
        <span class="category-count">${items.length} features &middot; ${esc(cat.sublabel)}</span>
      </div>
      <div class="feature-list">
        ${featureCards(items, cat.cssClass)}
      </div>
    </section>`;
  }).join('\n\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SAP SuccessFactors Learning | 1H 2026 Release Strategy</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ${header('./')}

  <main class="container">
    <!-- Summary Stats -->
    <div class="stats-grid">
      <div class="stat-card" data-cat="universal">
        <div class="stat-number">14</div>
        <div class="stat-label">Universal</div>
      </div>
      <div class="stat-card" data-cat="optin">
        <div class="stat-number">31</div>
        <div class="stat-label">Opt-In</div>
      </div>
      <div class="stat-card" data-cat="premium">
        <div class="stat-number">4</div>
        <div class="stat-label">Premium</div>
      </div>
      <div class="stat-card" data-cat="deprecation">
        <div class="stat-number">5</div>
        <div class="stat-label">Deprecation</div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline-bar">
      <h2>Release Timeline</h2>
      <div class="timeline-track">
        <div class="timeline-node">
          <div class="timeline-dot"></div>
          <div class="timeline-date">April 13</div>
          <div class="timeline-label">Preview</div>
        </div>
        <div class="timeline-node">
          <div class="timeline-dot"></div>
          <div class="timeline-date">May 15–16</div>
          <div class="timeline-label">Production</div>
        </div>
        <div class="timeline-node critical">
          <div class="timeline-dot"></div>
          <div class="timeline-date">Nov 20</div>
          <div class="timeline-label">Token Delete</div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <label>Filter:</label>
      <button class="filter-btn active" data-filter="all">All (54)</button>
      <button class="filter-btn" data-filter="universal">Universal (14)</button>
      <button class="filter-btn" data-filter="optin">Opt-In (31)</button>
      <button class="filter-btn" data-filter="premium">Premium (4)</button>
      <button class="filter-btn" data-filter="deprecation">Deprecation (5)</button>
      <input type="text" class="search-input" placeholder="Search features…" id="searchInput">
    </div>

    <!-- Category Sections -->
    ${categorySections}
  </main>

  ${footer()}

  <script>
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.category-section').forEach(sec => {
          sec.style.display = (filter === 'all' || sec.dataset.category === filter) ? '' : 'none';
        });
      });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      document.querySelectorAll('.feature-card').forEach(card => {
        const name = card.dataset.name || '';
        card.style.display = (!q || name.includes(q)) ? '' : 'none';
      });
      // Show category sections that have visible cards
      document.querySelectorAll('.category-section').forEach(sec => {
        const visibleCards = sec.querySelectorAll('.feature-card[style=""], .feature-card:not([style])');
        const hasVisible = Array.from(sec.querySelectorAll('.feature-card')).some(c => c.style.display !== 'none');
        sec.style.display = hasVisible ? '' : 'none';
      });
      // Reset filter buttons
      if (q) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        document.querySelectorAll('.category-section').forEach(sec => {
          const hasVisible = Array.from(sec.querySelectorAll('.feature-card')).some(c => c.style.display !== 'none');
          sec.style.display = hasVisible ? '' : 'none';
        });
      }
    });
  </script>
</body>
</html>`;
}

// ==================== FEATURE DETAIL PAGES ====================

function buildFeaturePage(feature, index) {
  const f = feature;
  const cat = f.category;
  const rc = recBadgeClass(f.recommendation);

  const prev = index > 0 ? allFeatures[index - 1] : null;
  const next = index < allFeatures.length - 1 ? allFeatures[index + 1] : null;

  const prevNav = prev
    ? `<a href="${prev.slug}.html" class="nav-link prev">
        <span class="nav-link-label">&larr; Previous</span>
        <span class="nav-link-title">${esc(prev.name)}</span>
      </a>`
    : `<div class="nav-placeholder"></div>`;

  const nextNav = next
    ? `<a href="${next.slug}.html" class="nav-link next">
        <span class="nav-link-label">Next &rarr;</span>
        <span class="nav-link-title">${esc(next.name)}</span>
      </a>`
    : `<div class="nav-placeholder"></div>`;

  const timelineRow = f.timeline
    ? `<div class="meta-item">
        <span class="meta-label">Timeline</span>
        <span class="meta-value" style="color:var(--deprecation)">${esc(f.timeline)}</span>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(f.name)} — SAP SF Learning 1H 2026</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  ${header('../')}

  <main class="container">
    <a href="../index.html" class="back-link">
      ${arrowLeft} Back to all features
    </a>

    <div class="feature-page-header">
      <span class="badge badge-cat ${cat.cssClass}">${esc(cat.label)}</span>
      <h1>${esc(f.name)}</h1>
      <span class="feature-id">Feature #${f.id} of 54</span>
    </div>

    <div class="content-sections">
      <div class="content-section">
        <h2>What Is This Feature?</h2>
        <p>${esc(f.description)}</p>
      </div>

      <div class="content-section">
        <h2>What Is Changing?</h2>
        <p>${esc(f.whatsChanging)}</p>
      </div>

      <div class="content-section">
        <h2>Why Should We Care?</h2>
        <p>${esc(f.whyItMatters)}</p>
      </div>

      <div class="content-section risk">
        <h2>Risk of Inaction</h2>
        <p>${esc(f.riskOfNotEnabling)}</p>
      </div>
    </div>

    <div class="meta-bar">
      <div class="meta-item">
        <span class="meta-label">Recommendation</span>
        <span class="meta-value">${esc(f.recommendation)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Type</span>
        <span class="meta-value">${esc(f.type)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Impact</span>
        <span class="meta-value">${esc(f.majorMinor)}</span>
      </div>
      ${timelineRow}
    </div>

    <nav class="feature-nav">
      ${prevNav}
      ${nextNav}
    </nav>
  </main>

  ${footer()}
</body>
</html>`;
}

// ==================== WRITE FILES ====================

const outDir = path.join(__dirname);
const featuresDir = path.join(outDir, 'features');

// Ensure features directory exists
if (!fs.existsSync(featuresDir)) {
  fs.mkdirSync(featuresDir, { recursive: true });
}

// Write index.html
fs.writeFileSync(path.join(outDir, 'index.html'), buildIndex());
console.log('✓ index.html');

// Write feature pages
allFeatures.forEach((f, i) => {
  const filename = `${f.slug}.html`;
  fs.writeFileSync(path.join(featuresDir, filename), buildFeaturePage(f, i));
  console.log(`✓ features/${filename}`);
});

console.log(`\nDone! Generated ${allFeatures.length + 1} files.`);
