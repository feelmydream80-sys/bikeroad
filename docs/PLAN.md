# 자전거 로드 (Bike Road) - 개발 계획

## 프로젝트 개요
사용자가 자전거 길을 추천하고, 지도에서 직접 길을 그리며, 다른 사용자와 공유할 수 있는 PWA 웹 애플리케이션.
향후 앱과 연동을 고려한 설계.

## 기술 스택

### Phase 1 (현재)
- **프론트엔드**: Vite + 순수 HTML/CSS/JS
- **지도**: Leaflet.js + OpenStreetMap
- **경로탐색**: OSRM (Open Source Routing Machine) 데모 서버
- **데이터 저장**: IndexedDB (브라우저 로컬)
- **PWA**: Vite PWA Plugin (Service Worker + Manifest)

### Phase 2 (향후)
- **백엔드**: Node.js + Express
- **데이터베이스**: PostgreSQL + PostGIS
- **인증**: JWT

---

## Phase 1: 핵심 경로 그리기

### 목표
지도에서 자전거 길을 그리고, 자동으로 도로를 따라 경로를 계산하며, 브라우저에 저장하는 기능 구현.

### 세부 기능

#### 1. 지도 기본 기능
- OpenStreetMap 지도 표시 (Leaflet)
- 확대/축소, 이동

#### 2. 경로 생성 모드
- **방식 A: 경유지 길찾기**
  - 지도 클릭으로 출발지/경유지/도착지 설정
  - 경유지 드래그로 순서 변경
  - 경유지 X 버튼으로 삭제
  - OSRM `/route/v1/bicycle/` API로 도로 따라 경로 계산
  - 실시간 거리(km) / 예상 시간(분) 표시

- **방식 B: 자유 그리기 + 맵매칭**
  - 지도 위에서 마우스/터치로 자유롭게 선 그리기
  - 그리는 동안 반투명 회색 선으로 획 표시
  - 그리기 종료 후 OSRM `/match/v1/bicycle/` API로 실제 도로에 매칭
  - 매칭 결과를 파란 선으로 확정 표시
  - 매칭 실패 시 사용자에게 직접 경유지 수정 유도

#### 3. 경로 정보 입력
- 경로 이름, 설명 입력
- 총 거리, 예상 시간 자동 계산

#### 4. 저장 및 관리
- IndexedDB에 GeoJSON + 메타데이터 저장
- 저장된 경로 목록 조회
- 저장된 경로 지도에서 다시 표시
- 저장된 경로 삭제

#### 5. PWA
- 오프라인 지도 타일 캐싱 (이전에 본 영역)
- 정적 자원 캐싱
- 홈 화면 설치 지원

---

## Phase 2: 서버 및 소셜 기능

### 목표
백엔드 구축 및 사용자 간 상호작용 기능 구현.

### 세부 기능
- 회원가입 / 로그인 (JWT)
- 로드 업로드 (서버 저장)
- 피드 형태로 다른 사용자 로드 탐색
- 로드 도전 (Challenge) 기록
- 로드 평가 (별점, 리뷰)

---

## Phase 3: 게이미피케이션

### 목표
사용자 참여를 유도하는 보상 시스템 구현.

### 세부 기능
- 도전 완료 시 경험치(EXP) 부여
- 레벨 시스템
- 트로피/업적 시스템
- 랭킹 (주간/월간/전체)

---

## 데이터 구조

### 로드 (Road) 객체
```json
{
  "id": "uuid-string",
  "name": "한강 자전거길",
  "description": "여의도 ~ 반포대교",
  "geometry": {
    "type": "LineString",
    "coordinates": [[126.97, 37.56], [126.98, 37.57]]
  },
  "waypoints": [
    {"lat": 37.56, "lng": 126.97, "type": "start"},
    {"lat": 37.57, "lng": 126.98, "type": "end"}
  ],
  "distance": 5200,
  "duration": 1200,
  "createdAt": "2026-05-06T10:00:00Z"
}
```

---

## OSRM API 사용법

### Route (경유지 길찾기)
```
GET https://router.project-osrm.org/route/v1/bicycle/{lng},{lat};{lng},{lat}?overview=full&geometries=geojson
```

### Match (자유 그리기 맵매칭)
```
GET https://router.project-osrm.org/match/v1/bicycle/{lng},{lat};{lng},{lat};...?overview=full&geometries=geojson
```

---

## 프로젝트 파일 구조

```
bike/
├── docs/
│   └── PLAN.md
├── public/
│   ├── icons/
│   └── manifest.json
├── src/
│   ├── main.js
│   ├── style.css
│   ├── map/
│   │   ├── init.js
│   │   ├── draw.js
│   │   ├── route.js
│   │   └── match.js
│   ├── db/
│   │   └── indexeddb.js
│   └── ui/
│       ├── sidebar.js
│       └── panels.js
├── index.html
├── vite.config.js
├── package.json
└── README.md
```
