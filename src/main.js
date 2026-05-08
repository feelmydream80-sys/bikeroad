import { initMap } from './map/init.js';
import { RouteManager } from './map/route.js';
import { DrawManager } from './map/draw.js';
import { saveRoad, getRoads, deleteRoad } from './db/indexeddb.js';

// 지도 초기화
const map = initMap();

// 매니저 초기화
const routeMgr = new RouteManager(map);
const drawMgr = new DrawManager(map);

// UI 요소
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const modeBtns = document.querySelectorAll('.mode-btn');
const panels = document.querySelectorAll('.panel');
const waypointList = document.getElementById('waypointList');
const routeInfo = document.getElementById('routeInfo');
const distVal = document.getElementById('distVal');
const timeVal = document.getElementById('timeVal');
const clearWaypointsBtn = document.getElementById('clearWaypoints');
const roadNameInput = document.getElementById('roadName');
const roadDescInput = document.getElementById('roadDesc');
const saveRoadBtn = document.getElementById('saveRoad');
const drawInfo = document.getElementById('drawInfo');
const drawDist = document.getElementById('drawDist');
const drawTime = document.getElementById('drawTime');
const clearDrawBtn = document.getElementById('clearDraw');
const drawNameInput = document.getElementById('drawName');
const drawDescInput = document.getElementById('drawDesc');
const saveDrawBtn = document.getElementById('saveDraw');
const savedList = document.getElementById('savedList');

let currentMode = 'waypoint';
let ctrlPressed = false;
let cursorOverlay = null;

function createCursorOverlay(content, bgColor) {
  const existing = document.getElementById('cursor-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'cursor-overlay';
  overlay.innerHTML = content;
  overlay.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    user-select: none;
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function removeCursorOverlay() {
  const existing = document.getElementById('cursor-overlay');
  if (existing) existing.remove();
}

document.addEventListener('mousemove', (e) => {
  const overlay = document.getElementById('cursor-overlay');
  if (!overlay) return;
  overlay.style.left = e.clientX + 'px';
  overlay.style.top = e.clientY + 'px';
});

function updateWaypointCursor() {
  if (currentMode !== 'waypoint') {
    removeCursorOverlay();
    return;
  }
  const count = routeMgr.getWaypoints().length;
  const label = count === 0 ? 'S' : (count + 1).toString();
  createCursorOverlay(
    `<div style="background:${count === 0 ? '#4CAF50' : '#2196F3'};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);">${label}</div>`
  );
}

function updateDrawCursor() {
  if (currentMode !== 'draw') {
    removeCursorOverlay();
    return;
  }
  createCursorOverlay(
    `<div style="font-size:24px;text-shadow:0 1px 3px rgba(0,0,0,0.4);">✏️</div>`
  );
}

// Ctrl 키로 지도 조작 토글
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

// 초기 지도 조작 비활성화 및 커서 설정
setMapControl(false);
updateWaypointCursor();

// 사이드바 토글
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebar.classList.toggle('closed');
});

// 모드 전환
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === currentMode) return;
    currentMode = mode;

    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${mode}`).classList.add('active');

    if (mode === 'waypoint') {
      drawMgr.clear();
      document.body.classList.remove('draw-mode');
      document.body.classList.add('waypoint-mode');
      updateWaypointCursor();
    } else {
      routeMgr.clear();
      removeCursorOverlay();
      document.body.classList.remove('waypoint-mode');
      document.body.classList.add('draw-mode');
      updateDrawCursor();
    }
  });
});

// 경유지 모드: 지도 클릭
map.on('click', (e) => {
  if (currentMode !== 'waypoint') return;
  if (drawMgr.consumeClick()) return; // 자유그리기 직후 클릭 무시
  routeMgr.addWaypoint(e.latlng);
});

// 경유지 업데이트 콜백
routeMgr.onUpdate = (route) => {
  updateWaypointUI();
  updateWaypointCursor();
  if (route) {
    distVal.textContent = (route.distance / 1000).toFixed(2);
    timeVal.textContent = Math.round(route.duration / 60);
    routeInfo.style.display = 'block';
    saveRoadBtn.disabled = false;
  } else {
    routeInfo.style.display = 'none';
    saveRoadBtn.disabled = true;
  }
};

// 자유그리기 업데이트 콜백
drawMgr.onUpdate = (route) => {
  if (route) {
    drawDist.textContent = (route.distance / 1000).toFixed(2);
    drawTime.textContent = Math.round(route.duration / 60);
    drawInfo.style.display = 'block';
    saveDrawBtn.disabled = false;
  } else {
    drawInfo.style.display = 'none';
    saveDrawBtn.disabled = true;
  }
};

function updateWaypointUI() {
  waypointList.innerHTML = '';
  const wps = routeMgr.getWaypoints();
  wps.forEach((wp, i) => {
    const div = document.createElement('div');
    div.className = 'waypoint-item';
    div.draggable = true;
    div.innerHTML = `
      <div class="wp-num">${i === 0 ? 'S' : i}</div>
      <div class="wp-coords">${wp.lat.toFixed(5)}, ${wp.lng.toFixed(5)}</div>
      <button class="wp-delete" data-index="${i}">×</button>
    `;
    div.querySelector('.wp-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      routeMgr.removeWaypoint(i);
    });
    waypointList.appendChild(div);
  });
}

clearWaypointsBtn.addEventListener('click', () => routeMgr.clear());
clearDrawBtn.addEventListener('click', () => drawMgr.clear());

// 저장 함수
async function saveCurrentRoad(mgr, nameInput, descInput) {
  const name = nameInput.value.trim();
  if (!name) {
    alert('경로 이름을 입력해주세요.');
    return;
  }
  const geojson = mgr.getGeoJSON();
  if (!geojson) {
    alert('경로를 먼저 그려주세요.');
    return;
  }
  const road = {
    name,
    description: descInput.value.trim(),
    geometry: geojson.geometry,
    waypoints: mgr.getWaypoints(),
    distance: geojson.properties.distance,
    duration: geojson.properties.duration,
  };
  try {
    await saveRoad(road);
    alert('경로가 저장되었습니다!');
    nameInput.value = '';
    descInput.value = '';
    mgr.clear();
    loadSavedRoads();
  } catch (e) {
    console.error(e);
    alert('저장 중 오류가 발생했습니다.');
  }
}

saveRoadBtn.addEventListener('click', () => saveCurrentRoad(routeMgr, roadNameInput, roadDescInput));
saveDrawBtn.addEventListener('click', () => saveCurrentRoad(drawMgr, drawNameInput, drawDescInput));

// 저장된 경로 표시
let routeLayers = [];

function clearRouteLayers() {
  routeLayers.forEach(l => map.removeLayer(l));
  routeLayers = [];
}

async function loadSavedRoads() {
  const roads = await getRoads();
  savedList.innerHTML = '';
  if (roads.length === 0) {
    savedList.innerHTML = '<p style="color:#999;font-size:0.85rem;">저장된 경로가 없습니다.</p>';
    return;
  }
  roads.forEach(road => {
    const div = document.createElement('div');
    div.className = 'saved-item';
    div.innerHTML = `
      <h4>${road.name}</h4>
      <p>${road.description || '설명 없음'}</p>
      <small>📏 ${(road.distance / 1000).toFixed(2)}km · ${new Date(road.createdAt).toLocaleDateString()}</small>
    `;
    div.addEventListener('click', () => showSavedRoad(road));

    // 삭제 버튼
    const delBtn = document.createElement('button');
    delBtn.textContent = '삭제';
    delBtn.style.cssText = 'margin-top:6px;padding:4px 8px;font-size:0.75rem;background:#ff4444;color:white;border:none;border-radius:4px;cursor:pointer;';
    delBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('정말 삭제하시겠습니까?')) {
        await deleteRoad(road.id);
        clearRouteLayers();
        loadSavedRoads();
      }
    });
    div.appendChild(delBtn);

    savedList.appendChild(div);
  });
}

function showSavedRoad(road) {
  clearRouteLayers();
  const layer = L.geoJSON(road.geometry, {
    style: { color: '#4CAF50', weight: 5, opacity: 0.9 },
  }).addTo(map);
  routeLayers.push(layer);
  map.fitBounds(layer.getBounds(), { padding: [50, 50] });

  // 마커 표시
  if (road.waypoints?.length) {
    road.waypoints.forEach((wp, i) => {
      const color = i === 0 ? '#4CAF50' : i === road.waypoints.length - 1 ? '#f44336' : '#2196F3';
      const m = L.marker([wp.lat, wp.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background:${color};color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.75rem;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${i === 0 ? 'S' : i}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);
      routeLayers.push(m);
    });
  }
}

// 초기 로드
loadSavedRoads();

// PWA 등록 (production에서만 활성화)
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && !location.hostname.startsWith('192.168.')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}
