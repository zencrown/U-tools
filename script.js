// GETTING ELEMENTS
let navBar = document.querySelector('.navBar');
let folderContainer = document.querySelector('.mainContainer');

const desktopMQ = window.matchMedia('(min-width: 700px)');
const navIcons = Array.from(navBar.querySelectorAll('.icon'));

const root = document.documentElement;

let current = 0;

// Slide the nav pill under the active tab (CSS animates the move)
function movePill() {
  const on = navIcons[current];
  if (!on) return;
  navBar.style.setProperty('--ix', on.offsetLeft + 'px');
  navBar.style.setProperty('--iw', on.offsetWidth + 'px');
}

function setActive(index) {
  current = index;
  navIcons.forEach((item, i) => item.classList.toggle('on', i === index));
  movePill();

  // Push the active section's color into the global theme
  const folder = folderContainer.querySelectorAll('.folders')[index];
  if (folder) {
    const c = getComputedStyle(folder).getPropertyValue('--c').trim();
    if (c) root.style.setProperty('--accent', c);
  }
}

setActive(0); // set the initial theme (AI section)

// Re-measure once fonts/layout settle, then switch the glide on
window.addEventListener('resize', movePill);
window.addEventListener('load', () => {
  movePill();
  requestAnimationFrame(() => navBar.classList.add('ready'));
});

navBar.addEventListener('click', (event) => {
  const icon = event.target.closest('.icon');
  if (!icon || !navBar.contains(icon)) return;

  const index = navIcons.indexOf(icon);
  if (index === current && !desktopMQ.matches) return; // already open

  // Which side should the next panel slide in from?
  folderContainer.style.setProperty('--dir', index > current ? 1 : -1);
  setActive(index);

  if (desktopMQ.matches) {
    // Desktop/tablet: all sections are visible, so scroll to the chosen one
    const folder = folderContainer.querySelectorAll('.folders')[index];
    if (folder) folder.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    flipFolders(index + 1);
  }
});

// Desktop/tablet: highlight the dock icon of the section being viewed
if ('IntersectionObserver' in window) {
  const sections = Array.from(folderContainer.querySelectorAll('.folders'));
  const io = new IntersectionObserver((entries) => {
    if (!desktopMQ.matches) return;
    entries.forEach((en) => {
      if (en.isIntersecting) setActive(sections.indexOf(en.target));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((f) => io.observe(f));
}

// Mobile (<700px): show one folder at a time.
// Desktop (>=700px): CSS shows every folder in a grid, this only toggles the class.
function flipFolders(e){
  let folders = folderContainer.querySelectorAll('.folders');
  let foldersCount = folders.length;
  for (let i = 0; i < foldersCount; i++) {
    folders[i].classList.remove('on');
  }
  if (folders[e - 1]) {
    void folders[e - 1].offsetWidth; // force reflow so the slide-in replays on every switch
    folders[e - 1].classList.add('on');
  }
}

// ---------- Desktop: link counter + search filter ----------
const searchInput = document.getElementById('search');
const linkCount = document.getElementById('linkCount');
const visibleFolders = Array.from(folderContainer.querySelectorAll('.folders'))
  .filter((f) => f.style.display !== 'none');
const totalLinks = visibleFolders.reduce((n, f) => n + f.querySelectorAll('a').length, 0);

if (linkCount) {
  linkCount.textContent = `${totalLinks} tools · ${visibleFolders.length} categories`;
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    visibleFolders.forEach((folder) => {
      let matches = 0;
      folder.querySelectorAll('a').forEach((a) => {
        const hit = !q || a.textContent.toLowerCase().includes(q) || a.href.toLowerCase().includes(q);
        a.classList.toggle('hide', !hit);
        if (hit) matches++;
      });
      folder.classList.toggle('empty', matches === 0);
    });
  });

  // Press "/" to jump to search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.blur();
    }
  });
}


// ---------- PWA: Service Worker registration (always keep it on bottom) ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Path is relative to this page (site root), resolves to /sw.js at the site root
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service worker registered:', reg.scope))
      .catch((err) => console.warn('Service worker registration failed:', err));
  });
}
