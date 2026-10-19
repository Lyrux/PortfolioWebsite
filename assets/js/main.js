/* Portfolio interactions — plain JavaScript, no dependencies. */

const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
const projectCount = document.querySelector('#project-count');

// Restore the user's preferred theme, falling back to the system preference.
let savedTheme;
try {
  savedTheme = localStorage.getItem('portfolio-theme');
} catch (_error) {
  // Local storage may be unavailable in some browser contexts.
}

const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
setTheme(savedTheme === 'dark' || savedTheme === 'light'
  ? savedTheme
  : (prefersLight ? 'light' : 'dark'));

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]')
    .setAttribute('content', theme === 'dark' ? '#0b1119' : '#f5f8fa');
}

themeToggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch (_error) {
    // The toggle still works for the current session.
  }
});

// Accessible small-screen navigation.
function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Filter sample projects using space-separated categories on each card.
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visible = 0;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      const show = filter === 'all' || categories.includes(filter);
      card.hidden = !show;
      if (show) visible += 1;
    });

    projectCount.textContent = `${String(visible).padStart(2, '0')} ${visible === 1 ? 'PROJECT' : 'PROJECTS'}`;
  });
});

// Keep the copyright year current.
document.querySelector('#year').textContent = new Date().getFullYear();
