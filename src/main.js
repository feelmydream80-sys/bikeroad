import { router } from './router.js';
import { renderNavbar, getNavbarStyles } from './components/navbar.js';
import { renderRoadPage } from './components/road-gallery.js';
import { renderChallengePage } from './components/challenge.js';
import { renderFeedPage } from './components/friend-feed.js';
import { renderProfilePage } from './components/profile.js';

let ctrlPressed = false;
let globalMap = null;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Control' && !ctrlPressed) {
    ctrlPressed = true;
    if (globalMap) {
      globalMap.dragging.enable();
      globalMap.touchZoom.enable();
      globalMap.scrollWheelZoom.enable();
      globalMap.doubleClickZoom.enable();
      globalMap.boxZoom.enable();
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Control') {
    ctrlPressed = false;
    if (globalMap) {
      globalMap.dragging.disable();
      globalMap.touchZoom.disable();
      globalMap.scrollWheelZoom.disable();
      globalMap.doubleClickZoom.disable();
      globalMap.boxZoom.disable();
    }
  }
});

function createGlobalMap() {
  if (globalMap) return globalMap;
  globalMap = L.map('globalMapContainer', {
    center: [37.5665, 126.9780],
    zoom: 13,
    zoomControl: false,
    dragging: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
  });

  L.control.zoom({ position: 'topright' }).addTo(globalMap);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(globalMap);

  globalMap.dragging.disable();
  return globalMap;
}

const navbarContainer = document.getElementById('navbar');
const styleEl = document.createElement('style');
styleEl.textContent = getNavbarStyles();
document.head.appendChild(styleEl);

renderNavbar(navbarContainer);

router.register('road', () => {
  const map = createGlobalMap();
  renderRoadPage('page-road', map);
});
router.register('challenge', () => {
  const map = createGlobalMap();
  renderChallengePage('page-challenge', map);
});
router.register('friend', () => renderFeedPage('page-friend', 'friend'));
router.register('popular', () => renderFeedPage('page-popular', 'popular'));
router.register('profile', () => {
  const map = createGlobalMap();
  renderProfilePage('page-profile', map);
});

router.onRouteChange = (route) => {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  if (route) {
    const pageId = route.path === '/' ? 'road' : route.path;
    const pageEl = document.getElementById(`page-${pageId}`);
    if (pageEl) pageEl.classList.add('active');
  }
};

document.body.insertAdjacentHTML('beforeend', '<div id="globalMapContainer"></div>');

router.navigate('road');

window.map = globalMap;
window.router = router;