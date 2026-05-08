import { mockRoads, getUserById, mockAchievements } from '../services/mock-data.js';

export function renderChallengePage(containerId, map) {
  const container = document.getElementById(containerId);

  container.innerHTML = `
    <h1 class="page-title">🏆 도전 과제</h1>

    <div class="sub-menu">
      <button class="active" data-filter="all">전체</button>
      <button data-filter="in-progress">🟢 진행 중</button>
      <button data-filter="completed">✅ 완료</button>
    </div>

    <div id="challengeList"></div>
  `;

  const listContainer = document.getElementById('challengeList');
  let filter = 'all';

  function renderChallenges() {
    listContainer.innerHTML = mockRoads.map(road => {
      const user = getUserById(road.userId);
      const isCompleted = mockAchievements.some(a => a.name.includes(road.name));

      return `
        <div class="challenge-card" data-id="${road.id}">
          <div class="challenge-header">
            <img src="${road.thumbnail}" alt="${road.name}" class="challenge-thumb" />
            <div class="challenge-info">
              <div class="challenge-name">${road.name}</div>
              <div class="challenge-meta">
                📏 ${road.distance}km · ⏱️ ${road.duration}분 · 🏆 ${road.completeCount}명 완주
              </div>
              <div style="margin-top:4px;font-size:0.8rem;color:#999;">
                작성자: ${user?.avatar || ''} ${user?.name || 'Anonymous'}
              </div>
            </div>
          </div>
          <div class="challenge-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${isCompleted ? 100 : 0}%"></div>
            </div>
            <div class="progress-text">
              ${isCompleted ? '✅ 완료!' : '아직 도전하지 않음'}
            </div>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px;">
            <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}" data-action="start" data-id="${road.id}">
              ${isCompleted ? '🔄 다시 도전' : '🎯 도전 시작'}
            </button>
            <button class="btn btn-secondary" data-action="view-route" data-id="${road.id}">🗺️ 경로 보기</button>
          </div>
        </div>
      `;
    }).join('');
  }

  container.querySelectorAll('.sub-menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.sub-menu button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filter = btn.dataset.filter;
      renderChallenges();
    });
  });

  listContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const roadId = btn.dataset.id;
    const road = mockRoads.find(r => r.id === roadId);

    if (!road) return;

    if (action === 'start') {
      startChallenge(road, map);
    } else if (action === 'view-route') {
      viewChallengeRoute(road, map);
    }
  });

  renderChallenges();
}

function startChallenge(road, map) {
  const confirmed = confirm(`"${road.name}" 길에 도전하시겠습니까?\n\n시작하면 GPS로您的位置를 추적합니다.`);

  if (confirmed) {
    showChallengeMap(road, map);
  }
}

function viewChallengeRoute(road, map) {
  if (window.challengeMapLayer) {
    map.removeLayer(window.challengeMapLayer);
  }

  const coords = road.geometry.coordinates.map(c => [c[1], c[0]]);
  window.challengeMapLayer = L.polyline(coords, {
    color: '#4CAF50',
    weight: 5,
    opacity: 0.9,
  }).addTo(map);

  map.fitBounds(window.challengeMapLayer.getBounds(), { padding: [50, 50] });

  alert('경로가 지도에 표시되었습니다!\n지도에서 Ctrl을 누른 채로 드래그하면 이동할 수 있습니다.');
}

function showChallengeMap(road, map) {
  const coords = road.geometry.coordinates.map(c => [c[1], c[0]]);

  if (window.challengeMapLayer) {
    map.removeLayer(window.challengeMapLayer);
  }

  window.challengeMapLayer = L.polyline(coords, {
    color: '#2196F3',
    weight: 5,
    opacity: 0.9,
  }).addTo(map);

  map.fitBounds(window.challengeMapLayer.getBounds(), { padding: [50, 50] });

  const totalDistance = road.distance * 1000;
  let traveledDistance = 0;

  if ('geolocation' in navigator) {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        let minDist = Infinity;
        for (const coord of coords) {
          const dist = Math.sqrt(
            Math.pow(userLat - coord[0], 2) + Math.pow(userLng - coord[1], 2)
          );
          if (dist < minDist) minDist = dist;
        }

        const onRoute = minDist < 0.0005;

        if (onRoute) {
          traveledDistance += 10;
          const progress = Math.min(100, (traveledDistance / totalDistance) * 100);

          if (progress >= 90) {
            alert(`🎉 축하합니다! "${road.name}" 완주!\n업적이 추가되었습니다!`);
            navigator.geolocation.clearWatch(watchId);
          }
        }
      },
      (error) => {
        console.error('GPS 오류:', error);
        alert('GPS 신호를 받을 수 없습니다.');
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert('GPS를 지원하지 않는 브라우저입니다.');
  }
}