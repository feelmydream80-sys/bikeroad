import { currentUser, getUserAchievements, getRoadsByUser } from '../services/mock-data.js';
import { DrawManager } from '../map/draw.js';
import { RouteManager } from '../map/route.js';
import { saveRoad, getRoads, addPointPhoto, addPointStory } from '../db/indexeddb.js';

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

  async function renderMyRoads() {
    const roads = await getRoads();
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
            <div class="road-card" data-id="${road.id}">
              <img src="${road.thumbnail || 'https://picsum.photos/seed/default/400/300'}" alt="${road.name}" />
              <div class="road-card-body">
                <div class="road-card-title">${road.name}</div>
                <div class="road-card-desc">${road.description || ''}</div>
                <div class="road-card-meta">
                  <span>📏 ${(road.distance / 1000).toFixed(1)}km</span>
                  <span>📍 ${(road.points?.length || 0)} 포인트</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      tabContent.querySelectorAll('.road-card').forEach(card => {
        card.addEventListener('click', async () => {
          const roadId = card.dataset.id;
          const road = roads.find(r => r.id === roadId);
          if (road) showRoadDetail(road);
        });
      });
    }
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
        <div id="createMap" style="height:400px;border-radius:12px;margin-bottom:16px;"></div>
        <div style="margin-bottom:12px;">
          <button id="addPointBtn" class="btn btn-secondary" disabled>📍 포인트 추가</button>
          <span id="pointCount" style="color:#999;font-size:0.85rem;margin-left:8px;">0개 포인트</span>
        </div>
        <div id="routeInfo" style="display:none;background:#e3f2fd;padding:12px;border-radius:8px;margin-bottom:16px;">
          <p>📏 거리: <strong id="distVal">0</strong> km</p>
          <p>⏱️ 예상 시간: <strong id="timeVal">0</strong> 분</p>
        </div>
        <input type="text" id="roadName" placeholder="경로 이름" style="margin-bottom:8px;" />
        <textarea id="roadDesc" placeholder="경로 설명" style="margin-bottom:8px;"></textarea>
        <button id="saveBtn" class="btn btn-primary" disabled>저장</button>
      </div>
    `;

    const createMap = L.map('createMap', {
      center: [37.5665, 126.9780],
      zoom: 13,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(createMap);

    const routeMgr = new RouteManager(createMap);
    const drawMgr = new DrawManager(createMap);
    let mode = 'waypoint';
    let points = [];
    let pointMarkers = [];
    let tempMarker = null;

    const addPointBtn = document.getElementById('addPointBtn');
    const pointCount = document.getElementById('pointCount');

    function updatePointCount() {
      pointCount.textContent = `${points.length}개 포인트`;
    }

    function addPointMarker(latlng) {
      const pointId = crypto.randomUUID();
      const marker = L.marker(latlng, {
        icon: L.divIcon({
          className: 'point-marker',
          html: `<div style="background:#FF9800;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);">${points.length + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).addTo(createMap);

      marker.pointId = pointId;
      marker.on('click', () => showPointModal(pointId, latlng));

      points.push({
        id: pointId,
        lat: latlng.lat,
        lng: latlng.lng,
        name: '',
        photos: [],
        stories: [],
      });

      pointMarkers.push(marker);
      updatePointCount();
      addPointBtn.disabled = false;
    }

    addPointBtn.addEventListener('click', () => {
      if (tempMarker) {
        createMap.removeLayer(tempMarker);
      }
      createMap.getContainer().style.cursor = 'crosshair';

      const handler = (e) => {
        addPointMarker(e.latlng);
        createMap.getContainer().style.cursor = '';
        createMap.off('click', handler);
        tempMarker = null;
      };

      createMap.on('click', handler);

      setTimeout(() => {
        createMap.getContainer().style.cursor = '';
        createMap.off('click', handler);
      }, 10000);
    });

    function showPointModal(pointId, latlng) {
      const point = points.find(p => p.id === pointId);
      if (!point) return;

      const modal = document.createElement('div');
      modal.className = 'point-modal';
      modal.innerHTML = `
        <div class="point-modal-content">
          <div class="point-modal-header">
            <div class="point-modal-title">📍 포인트 ${points.indexOf(point) + 1}</div>
            <button class="point-modal-close">&times;</button>
          </div>
          <input type="text" class="point-name-input" placeholder="포인트 이름 (예: 한강 다리)" value="${point.name || ''}" />
          <div class="point-photos">
            ${point.photos.map((photo, i) => `
              <img src="${photo.url}" alt="photo${i}" class="point-photo" />
            `).join('')}
            <div class="point-add-photo" data-point="${pointId}">+</div>
          </div>
          <div class="point-stories">
            ${point.stories.map(story => {
              const user = { avatar: '👤', name: '나' };
              return `
                <div class="point-story">
                  <div class="point-story-header">
                    <div class="point-story-avatar">${user.avatar}</div>
                    <div class="point-story-user">${user.name}</div>
                    <div class="point-story-time">${formatTime(story.createdAt)}</div>
                  </div>
                  <div class="point-story-content">${story.content}</div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="point-add-story">
            <input type="text" placeholder="이곳에 대한 이야기를 적어보세요..." />
            <button>등록</button>
          </div>
        </div>
      `;

      modal.querySelector('.point-modal-close').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });

      const nameInput = modal.querySelector('.point-name-input');
      nameInput.addEventListener('change', () => {
        point.name = nameInput.value;
      });

      const photoInput = modal.querySelector('.point-add-photo');
      photoInput.addEventListener('click', () => {
        const url = prompt('이미지 URL을 입력하세요 (예: https://...):');
        if (url) {
          point.photos.push({ url, userId: currentUser.id });
          showPointModal(pointId, latlng);
        }
      });

      const storyInput = modal.querySelector('.point-add-story input');
      const storyBtn = modal.querySelector('.point-add-story button');
      storyBtn.addEventListener('click', () => {
        const content = storyInput.value.trim();
        if (content) {
          point.stories.push({ content, userId: currentUser.id });
          showPointModal(pointId, latlng);
        }
      });

      storyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') storyBtn.click();
      });

      document.body.appendChild(modal);
    }

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
        points,
      };

      try {
        await saveRoad(road);
        alert('저장되었습니다!');
        pointMarkers.forEach(m => createMap.removeLayer(m));
        pointMarkers = [];
        points = [];
        routeMgr.clear();
        drawMgr.clear();
        activeTab = 'my-roads';
        container.querySelector('[data-tab="my-roads"]').click();
      } catch (e) {
        console.error(e);
        alert('저장 중 오류가 발생했습니다.');
      }
    });
  }

  async function showRoadDetail(road) {
    const modal = document.createElement('div');
    modal.className = 'point-modal';
    modal.innerHTML = `
      <div class="point-modal-content">
        <div class="point-modal-header">
          <div class="point-modal-title">🚴 ${road.name}</div>
          <button class="point-modal-close">&times;</button>
        </div>
        <p style="color:#666;margin-bottom:16px;">${road.description || ''}</p>
        <div style="display:flex;gap:16px;font-size:0.9rem;color:#666;margin-bottom:16px;">
          <span>📏 ${(road.distance / 1000).toFixed(1)}km</span>
          <span>⏱️ ${Math.round(road.duration / 60)}분</span>
          <span>📍 ${(road.points?.length || 0)} 포인트</span>
        </div>
        <div id="roadPointsList" style="max-height:300px;overflow-y:auto;">
          ${road.points?.length > 0 ? road.points.map((point, i) => `
            <div style="padding:12px;background:#f5f5f5;border-radius:8px;margin-bottom:8px;">
              <div style="font-weight:bold;color:#333;">📍 ${point.name || '포인트 ' + (i + 1)}</div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:8px 0;">
                ${point.photos?.map(photo => `<img src="${photo.url}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:4px;" />`).join('') || '<span style="color:#999;font-size:0.8rem;">사진 없음</span>'}
              </div>
              ${point.stories?.map(story => `
                <div style="font-size:0.85rem;color:#666;padding:4px 0;">💬 ${story.content}</div>
              `).join('') || ''}
            </div>
          `).join('') : '<p style="color:#999;text-align:center;padding:20px;">포인트가 없습니다</p>'}
        </div>
      </div>
    `;

    modal.querySelector('.point-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
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