import { currentUser, getUserAchievements, getRoadsByUser } from '../services/mock-data.js';
import { DrawManager } from '../map/draw.js';
import { RouteManager } from '../map/route.js';
import { saveRoad, getRoads } from '../db/indexeddb.js';

export function renderProfilePage(containerId, map) {
  const container = document.getElementById(containerId);
  const achievements = getUserAchievements(currentUser.id);
  const myRoads = getRoadsByUser(currentUser.id);

  container.innerHTML = `
    <h1 class="page-title">👤 내 정보</h1>

    <div class="profile-header">
      <div class="profile-avatar">${currentUser.avatar}</div>
      <div class="profile-name">${currentUser.name}</div>
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-value">${myRoads.length}</div>
          <div class="profile-stat-label">내 경로</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">${achievements.length}</div>
          <div class="profile-stat-label">업적</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">${achievements.filter(a => a.name.includes('완료')).length}</div>
          <div class="profile-stat-label">완주</div>
        </div>
      </div>
    </div>

    <div class="sub-menu">
      <button class="active" data-tab="my-roads">🚴 나의 경로</button>
      <button data-tab="achievements">🏆 업적</button>
      <button data-tab="create">➕ 만들기</button>
    </div>

    <div id="profileTabContent"></div>
  `;

  const tabContent = document.getElementById('profileTabContent');
  let activeTab = 'my-roads';

  function renderTab() {
    if (activeTab === 'my-roads') {
      renderMyRoads();
    } else if (activeTab === 'achievements') {
      renderAchievements();
    } else if (activeTab === 'create') {
      renderCreateTab();
    }
  }

  function renderMyRoads() {
    const savedRoads = getRoads();
    Promise.resolve(savedRoads).then(roads => {
      if (roads.length === 0) {
        tabContent.innerHTML = `
          <div style="text-align:center;padding:40px;color:#999;">
            <p style="font-size:3rem;">🚴</p>
            <p>아직 만든 경로가 없습니다</p>
            <button class="btn btn-primary" onclick="document.querySelector('[data-tab=create]').click()" style="margin-top:16px;">경로 만들기</button>
          </div>
        `;
      } else {
        tabContent.innerHTML = `
          <div class="card-grid">
            ${roads.map(road => `
              <div class="road-card">
                <img src="${road.thumbnail || 'https://picsum.photos/seed/default/400/300'}" alt="${road.name}" />
                <div class="road-card-body">
                  <div class="road-card-title">${road.name}</div>
                  <div class="road-card-desc">${road.description || ''}</div>
                  <div class="road-card-meta">
                    <span>📏 ${(road.distance / 1000).toFixed(1)}km</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    });
  }

  function renderAchievements() {
    if (achievements.length === 0) {
      tabContent.innerHTML = `
        <div style="text-align:center;padding:40px;color:#999;">
          <p style="font-size:3rem;">🏆</p>
          <p>아직 달성한 업적이 없습니다</p>
          <p style="font-size:0.85rem;">도전 과제를 완료하면 업적을 획득할 수 있어요!</p>
        </div>
      `;
    } else {
      tabContent.innerHTML = `
        <div class="achievement-list">
          ${achievements.map(a => `
            <div class="achievement-item">
              <div class="achievement-icon">🏆</div>
              <div class="achievement-info">
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-desc">${a.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  function renderCreateTab() {
    tabContent.innerHTML = `
      <div style="padding:16px;">
        <h3 style="margin-bottom:16px;">경로 만들기</h3>
        <div class="sub-menu" style="margin-bottom:16px;">
          <button class="active" data-mode="waypoint">📍 경유지</button>
          <button data-mode="draw">✏️ 자유그리기</button>
        </div>
        <div id="map" style="height:400px;border-radius:12px;margin-bottom:16px;"></div>
        <div id="routeInfo" style="display:none;background:#e3f2fd;padding:12px;border-radius:8px;margin-bottom:16px;">
          <p>📏 거리: <strong id="distVal">0</strong> km</p>
          <p>⏱️ 예상 시간: <strong id="timeVal">0</strong> 분</p>
        </div>
        <input type="text" id="roadName" placeholder="경로 이름" style="margin-bottom:8px;" />
        <textarea id="roadDesc" placeholder="경로 설명" style="margin-bottom:8px;"></textarea>
        <button id="saveBtn" class="btn btn-primary" disabled>저장</button>
      </div>
    `;

    const createMap = L.map('map', {
      center: [37.5665, 126.9780],
      zoom: 13,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(createMap);

    const routeMgr = new RouteManager(createMap);
    const drawMgr = new DrawManager(createMap);
    let mode = 'waypoint';

    tabContent.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        tabContent.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.dataset.mode;
        if (mode === 'waypoint') {
          drawMgr.clear();
        } else {
          routeMgr.clear();
        }
      });
    });

    routeMgr.onUpdate = (route) => {
      const info = document.getElementById('routeInfo');
      const distVal = document.getElementById('distVal');
      const timeVal = document.getElementById('timeVal');
      const saveBtn = document.getElementById('saveBtn');
      if (route) {
        distVal.textContent = (route.distance / 1000).toFixed(2);
        timeVal.textContent = Math.round(route.duration / 60);
        info.style.display = 'block';
        saveBtn.disabled = false;
      } else {
        info.style.display = 'none';
        saveBtn.disabled = true;
      }
    };

    drawMgr.onUpdate = (route) => {
      const info = document.getElementById('routeInfo');
      const distVal = document.getElementById('distVal');
      const timeVal = document.getElementById('timeVal');
      const saveBtn = document.getElementById('saveBtn');
      if (route) {
        distVal.textContent = (route.distance / 1000).toFixed(2);
        timeVal.textContent = Math.round(route.duration / 60);
        info.style.display = 'block';
        saveBtn.disabled = false;
      } else {
        info.style.display = 'none';
        saveBtn.disabled = true;
      }
    };

    document.getElementById('saveBtn').addEventListener('click', async () => {
      const name = document.getElementById('roadName').value.trim();
      const desc = document.getElementById('roadDesc').value.trim();
      const mgr = mode === 'waypoint' ? routeMgr : drawMgr;
      const geojson = mgr.getGeoJSON();

      if (!name) {
        alert('경로 이름을 입력해주세요.');
        return;
      }
      if (!geojson) {
        alert('경로를 먼저 만들어주세요.');
        return;
      }

      const road = {
        name,
        description: desc,
        geometry: geojson.geometry,
        waypoints: mgr.getWaypoints(),
        distance: geojson.properties.distance,
        duration: geojson.properties.duration,
        thumbnail: `https://picsum.photos/seed/${Date.now()}/400/300`,
      };

      try {
        await saveRoad(road);
        alert('저장되었습니다!');
        activeTab = 'my-roads';
        container.querySelector('[data-tab="my-roads"]').click();
      } catch (e) {
        console.error(e);
        alert('저장 중 오류가 발생했습니다.');
      }
    });
  }

  container.querySelectorAll('.sub-menu button[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.sub-menu button[data-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      renderTab();
    });
  });

  renderTab();
}