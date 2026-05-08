import { router } from './router.js';
import { renderNavbar, getNavbarStyles } from './components/navbar.js';
import { renderRoadPage } from './components/road-gallery.js';
import { renderChallengePage } from './components/challenge.js';
import { renderFeedPage } from './components/friend-feed.js';
import { renderProfilePage } from './components/profile.js';

const map = L.map('map', {
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

L.control.zoom({ position: 'topright' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

let ctrlPressed = false;

function setMapControl(enabled) {
  if (enabled) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
  } else {
    map.dragging.disable();
    map.touchZoom.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Control' && !ctrlPressed) {
    ctrlPressed = true;
    setMapControl(true);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Control') {
    ctrlPressed = false;
    setMapControl(false);
  }
});

setMapControl(false);

const navbarContainer = document.getElementById('navbar');
const styleEl = document.createElement('style');
styleEl.textContent = getNavbarStyles();
document.head.appendChild(styleEl);

renderNavbar(navbarContainer);

router.register('road', () => renderRoadPage('page-road', map));
router.register('challenge', () => renderChallengePage('page-challenge', map));
router.register('friend', () => renderFeedPage('page-friend', 'friend'));
router.register('popular', () => renderFeedPage('page-popular', 'popular'));
router.register('profile', () => renderProfilePage('page-profile', map));

router.onRouteChange = (route) => {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  if (route) {
    const pageId = route.path === '/' ? 'road' : route.path;
    const pageEl = document.getElementById(`page-${pageId}`);
    if (pageEl) pageEl.classList.add('active');
  }
};

router.navigate('road');

window.map = map;
window.router = router;