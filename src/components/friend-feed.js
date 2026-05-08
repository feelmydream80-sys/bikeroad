import { mockRoads, mockUsers, getUserById, mockFriends, currentUser, getFriendRoads, getCommentsByRoad } from '../services/mock-data.js';

export function renderFeedPage(containerId, type) {
  const container = document.getElementById(containerId);
  const isFriendFeed = type === 'friend';

  const title = isFriendFeed ? '👥 친구 소식' : '🔥 인기 소식';
  const description = isFriendFeed ? '친구들이 만든 새로운 경로' : '가장 인기 있는 경로들';

  container.innerHTML = `
    <h1 class="page-title">${title}</h1>
    <p style="color:#666;margin-bottom:16px;">${description}</p>
    <div id="feedList"></div>
  `;

  const feedList = document.getElementById('feedList');

  let feedRoads = isFriendFeed ? getFriendRoads(currentUser.id) : [...mockRoads];

  if (feedRoads.length === 0) {
    feedRoads = mockRoads;
  }

  if (!isFriendFeed) {
    feedRoads.sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount));
  }

  function renderFeed() {
    feedList.innerHTML = feedRoads.map(road => {
      const user = getUserById(road.userId);
      const comments = getCommentsByRoad(road.id).slice(0, 2);
      const timeAgo = getTimeAgo(road.createdAt);

      return `
        <div class="feed-card" data-id="${road.id}">
          <div class="feed-header">
            <div class="feed-avatar">${user?.avatar || '👤'}</div>
            <div class="feed-user-info">
              <div class="feed-user-name">${user?.name || 'Anonymous'}</div>
              <div class="feed-time">${timeAgo}</div>
            </div>
          </div>
          <div class="feed-content">
            <img src="${road.thumbnail}" alt="${road.name}" style="width:100%;border-radius:8px;margin-bottom:12px;" />
            <h3 style="margin-bottom:8px;">${road.name}</h3>
            <p style="color:#666;font-size:0.9rem;margin-bottom:12px;">${road.description}</p>
            <div style="display:flex;gap:16px;font-size:0.85rem;color:#666;">
              <span>📏 ${road.distance}km</span>
              <span>⏱️ ${road.duration}분</span>
              <span>🏆 ${road.completeCount}명 완주</span>
            </div>
          </div>
          <div class="feed-actions">
            <div class="feed-action" data-action="like" data-id="${road.id}">
              ❤️ 좋아요 ${road.likeCount}
            </div>
            <div class="feed-action" data-action="comment" data-id="${road.id}">
              💬 댓글 ${road.commentCount}
            </div>
            <div class="feed-action" data-action="share" data-id="${road.id}">
              📤 공유
            </div>
          </div>
          ${comments.length > 0 ? `
            <div style="margin-top:12px;padding-top:12px;border-top:1px solid #eee;">
              ${comments.map(c => {
                const commentUser = getUserById(c.userId);
                return `
                  <div style="margin-bottom:8px;">
                    <strong>${commentUser?.name || 'Anonymous'}</strong>
                    <span style="color:#666;">${c.content}</span>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  feedList.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]');
    if (!action) return;

    const actionType = action.dataset.action;
    const roadId = action.dataset.id;
    const road = mockRoads.find(r => r.id === roadId);

    if (actionType === 'like' && road) {
      const isLiked = action.textContent.includes('🤍');
      road.likeCount += isLiked ? 1 : -1;
      renderFeed();
    } else if (actionType === 'comment') {
      alert('댓글 기능은 곧 추가됩니다!');
    } else if (actionType === 'share') {
      if (navigator.share) {
        navigator.share({
          title: road?.name || '자전거 로드',
          text: road?.description || '나만의 자전거 경로를 공유합니다!',
          url: window.location.href,
        });
      } else {
        alert('링크가 복사되었습니다!');
      }
    }
  });

  renderFeed();
}

function getTimeAgo(dateString) {
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