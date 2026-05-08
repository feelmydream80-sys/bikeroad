import { mockRoads, mockUsers, getUserById, isLiked } from '../services/mock-data.js';
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
            <div style="margin-top:8px;display:flex;gap:8px;">
              <button class="btn ${liked ? 'btn-primary' : 'btn-secondary'}" data-action="like" data-id="${road.id}">
                ${liked ? '❤️ 좋아요' : '🤍 좋아요'}
              </button>
              <button class="btn btn-secondary" data-action="comment" data-id="${road.id}">💬 댓글</button>
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
        if (road) showRoadDetail(road, map);
      }
      return;
    }

    const action = btn.dataset.action;
    const roadId = btn.dataset.id;

    if (action === 'like') {
      const road = mockRoads.find(r => r.id === roadId);
      if (road) {
        road.likeCount += btn.textContent.includes('🤍') ? 1 : -1;
        renderRoads();
      }
    } else if (action === 'challenge') {
      const road = mockRoads.find(r => r.id === roadId);
      if (road) {
        window.router.navigate('challenge');
      }
    } else if (action === 'comment') {
      alert('댓글 기능은 곧 추가됩니다!');
    }
  });

  renderRoads();
}

function showRoadDetail(road, map) {
  alert(`경로: ${road.name}\n거리: ${road.distance}km\n${road.description}`);
}