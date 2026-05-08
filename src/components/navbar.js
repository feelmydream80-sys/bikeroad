import { router } from '../router.js';

export function renderNavbar(container) {
  container.innerHTML = `
    <nav class="navbar">
      <div class="nav-brand">🚴 자전거 로드</div>
      <div class="nav-menu">
        <a href="#road" class="nav-item" data-page="road">자전거 로드</a>
        <a href="#challenge" class="nav-item" data-page="challenge">도전 과제</a>
        <a href="#friend" class="nav-item" data-page="friend">친구 소식</a>
        <a href="#popular" class="nav-item" data-page="popular">인기 소식</a>
        <a href="#profile" class="nav-item" data-page="profile">내 정보</a>
      </div>
    </nav>
  `;

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      router.navigate(page);
    });
  });
}

export function getNavbarStyles() {
  return `
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 56px;
      background: #2196F3;
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1001;
    }
    .nav-brand {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .nav-menu {
      display: flex;
      gap: 8px;
    }
    .nav-item {
      padding: 8px 16px;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      border-radius: 20px;
      transition: 0.2s;
      font-size: 0.9rem;
    }
    .nav-item:hover {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    .nav-item.active {
      background: rgba(255,255,255,0.3);
      color: white;
      font-weight: bold;
    }
    @media (max-width: 768px) {
      .nav-menu {
        overflow-x: auto;
        gap: 4px;
        flex: 1;
        justify-content: flex-start;
      }
      .nav-item {
        padding: 6px 12px;
        font-size: 0.8rem;
        white-space: nowrap;
      }
    }
  `;
}