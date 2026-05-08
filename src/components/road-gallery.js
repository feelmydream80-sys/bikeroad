import { mockRoads, mockUsers, getUserById, isLiked, getAllChallengerPhotos } from '../services/mock-data.js';
import { currentUser } from '../services/mock-data.js';

export function renderRoadPage(containerId, map) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <h1 class="page-title">🚴 자전거 로드</h1>
    <div class="sub-menu">
      <button class="active" data-sort="popular">🔥 인기순</button>
      <button data-sort="recent">🕐 최신순</button>
      <button data-sort="challenge">🏆 도전 많은 순</button>
    </div>
    <div class="card-grid" id="roadGrid"></div>
  `;

  const roadGrid = document.getElementById('roadGrid');
  let sortType = 'popular';

  function renderRoads() {
    let roads = [...mockRoads];

    if (sortType === 'popular') {
      roads.sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount));
    } else if (sortType === 'recent') {
      roads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortType === 'challenge') {
      roads.sort((a, b) => b.challengeCount - a.challengeCount);
    }

    roadGrid.innerHTML = roads.map(road => {
      const user = getUserById(road.userId);
      const liked = isLiked(road.id, currentUser.id);

      return `
        <div class="road-card" data-id="${road.id}">
          <img src="${road.thumbnail}" alt="${road.name}" />
          <div class="road-card-body">
            <div class="road-card-title">${road.name}</div>
            <div class="road-card-desc">${road.description}</div>
            <div class="road-card-meta">
              <span>❤️ ${road.likeCount}</span>
              <span>💬 ${road.commentCount}</span>
              <span>🏆 ${road.completeCount}명 완주</span>
            </div>
            <div class="road-card-user">
              <span style="font-size:1.2rem;">${user?.avatar || '👤'}</span>
              <span class="name">${user?.name || 'Anonymous'}</span>
            </div>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn ${liked ? 'btn-primary' : 'btn-secondary'}" data-action="like" data-id="${road.id}">
                ${liked ? '❤️ 좋아요' : '🤍 좋아요'}
              </button>
              <button class="btn btn-secondary" data-action="view" data-id="${road.id}">📖 상세보기</button>
              <button class="btn btn-primary" data-action="challenge" data-id="${road.id}">🏆 도전하기</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  container.querySelectorAll('.sub-menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.sub-menu button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sortType = btn.dataset.sort;
      renderRoads();
    });
  });

  roadGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) {
      const card = e.target.closest('.road-card');
      if (card) {
        const roadId = card.dataset.id;
        const road = mockRoads.find(r => r.id === roadId);
        if (road) showRoadDetailModal(road);
      }
      return;
    }

    const action = btn.dataset.action;
    const roadId = btn.dataset.id;
    const road = mockRoads.find(r => r.id === roadId);

    if (action === 'like' && road) {
      road.likeCount += btn.textContent.includes('🤍') ? 1 : -1;
      renderRoads();
    } else if (action === 'view' && road) {
      showRoadDetailModal(road);
    } else if (action === 'challenge' && road) {
      showRoadDetailModal(road);
    }
  });

  renderRoads();
}

function showRoadDetailModal(road) {
  const user = getUserById(road.userId);
  const challengerPhotos = getAllChallengerPhotos(road);
  const coords = road.geometry.coordinates.map(c => [c[1], c[0]]);

  const modal = document.createElement('div');
  modal.className = 'road-detail-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="this.closest('.road-detail-modal').remove()">&times;</button>
      
      <img src="${road.thumbnail}" class="modal-thumbnail" alt="${road.name}" />
      
      <div class="modal-map" id="modalMap"></div>
      
      <h2 class="modal-title">${road.name}</h2>
      <p class="modal-desc">${road.description}</p>
      
      <div class="modal-stats">
        <span>❤️ ${road.likeCount}</span>
        <span>💬 ${road.commentCount}</span>
        <span>🏆 도전 ${road.challengeCount}</span>
        <span>✅ 완주 ${road.completeCount}</span>
      </div>
      
      ${road.points && road.points.length > 0 ? `
        <div class="modal-points">
          <h3>📍 포인트</h3>
          ${road.points.map((point, idx) => `
            <div class="modal-point">
              <div class="point-header">
                <span class="point-num">${idx + 1}</span>
                <div class="point-info">
                  <strong>${point.name}</strong>
                  ${point.memo ? `<p class="point-memo">${point.memo}</p>` : ''}
                </div>
              </div>
              <img src="${point.creatorPhoto}" class="point-creator-photo" alt="${point.name}" />
              ${point.challengerPhotos && point.challengerPhotos.length > 0 ? `
                <div class="point-challengers">
                  <h4>📷 다른 도전자들의 사진</h4>
                  <div class="challenger-gallery">
                    ${point.challengerPhotos.map(cp => {
                      const cpUser = getUserById(cp.userId);
                      return `
                        <div class="challenger-card">
                          <img src="${cp.url}" alt="challenger photo" />
                          <div class="challenger-info">
                            <span class="challenger-avatar">${cpUser?.avatar || '👤'}</span>
                            <span class="challenger-name">${cpUser?.name || 'Anonymous'}</span>
                            <p class="challenger-comment">${cp.comment}</p>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${challengerPhotos.length > 0 && (!road.points || road.points.length === 0) ? `
        <div class="modal-challengers">
          <h3>📷 다른 도전자들의 사진</h3>
          <div class="challenger-gallery">
            ${challengerPhotos.map(cp => {
              const cpUser = getUserById(cp.userId);
              return `
                <div class="challenger-card">
                  <img src="${cp.url}" alt="challenger photo" />
                  <div class="challenger-info">
                    <span class="challenger-avatar">${cpUser?.avatar || '👤'}</span>
                    <span class="challenger-name">${cpUser?.name || 'Anonymous'}</span>
                    <p class="challenger-comment">${cp.comment}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
      
      <button class="btn btn-primary modal-challenge-btn">🏆 도전하기</button>
    </div>
  `;

  document.body.appendChild(modal);

  setTimeout(() => {
    const modalMap = L.map('modalMap', {
      center: coords[0] || [37.5665, 126.9780],
      zoom: 13,
      dragging: false,
      zoomControl: true,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(modalMap);

    L.polyline(coords, {
      color: '#4CAF50',
      weight: 5,
      opacity: 0.9,
    }).addTo(modalMap);

    if (road.points && road.points.length > 0) {
      road.points.forEach((point, i) => {
        const hasPhoto = point.creatorPhoto;
        const hasMemo = point.memo;

        let markerContent = `<div class="map-point-marker">
          <div class="map-point-num">${i + 1}</div>`;

        if (hasPhoto) {
          markerContent += `<img src="${point.creatorPhoto}" class="map-point-photo" />`;
        }

        if (hasMemo) {
          markerContent += `<div class="map-point-memo">📝</div>`;
        }

        markerContent += `</div>`;

        const markerIcon = L.divIcon({
          html: markerContent,
          className: 'custom-map-point-marker',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        L.marker([point.lat, point.lng], {
          icon: markerIcon
        }).addTo(modalMap).bindPopup(`
          <div class="marker-popup">
            ${hasPhoto ? `<img src="${point.creatorPhoto}" class="marker-popup-photo" />` : ''}
            <strong>${point.name}</strong>
            ${point.memo ? `<p class="marker-popup-memo">${point.memo}</p>` : ''}
          </div>
        `);
      });
    }

    modalMap.fitBounds(modalMap.getBounds(), { padding: [20, 20] });
  }, 100);
}