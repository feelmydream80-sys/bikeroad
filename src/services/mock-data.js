export const mockUsers = [
  { id: 'user1', name: '김철수', avatar: '🚴', createdAt: '2025-01-01' },
  { id: 'user2', name: '이영희', avatar: '🏃', createdAt: '2025-01-15' },
  { id: 'user3', name: '박민수', avatar: '🎨', createdAt: '2025-02-01' },
  { id: 'user4', name: '정수진', avatar: '📷', createdAt: '2025-02-15' },
  { id: 'user5', name: '최준호', avatar: '🎮', createdAt: '2025-03-01' },
];

export const currentUser = mockUsers[0];

export const mockRoads = [
  {
    id: 'road1',
    userId: 'user2',
    name: '한강 자전거길',
    description: '서울 한강을 따라 달리는 멋진 길입니다. 야경도很不错!',
    thumbnail: 'https://picsum.photos/seed/hanriver/800/400',
    geometry: {
      type: 'LineString',
      coordinates: [
        [126.9780, 37.5665],
        [126.9750, 37.5700],
        [126.9700, 37.5750],
        [126.9650, 37.5800],
      ],
    },
    distance: 12.5,
    duration: 45,
    likeCount: 128,
    commentCount: 23,
    challengeCount: 89,
    completeCount: 67,
    createdAt: '2025-04-01T10:00:00Z',
    points: [
      {
        id: 'p1',
        lat: 37.5665,
        lng: 126.9780,
        name: '시작점 - 광화문',
        memo: '출발은 광화문 광장에서! 역사적인 곳에서 시작해요',
        creatorPhoto: 'https://picsum.photos/seed/road1_p1/400/300',
        challengerPhotos: [
          { url: 'https://picsum.photos/seed/c1_1/400/300', userId: 'user3', comment: '출발했어요!' },
          { url: 'https://picsum.photos/seed/c1_2/400/300', userId: 'user4', comment: '오늘 날씨 좋아요' },
          { url: 'https://picsum.photos/seed/c1_3/400/300', userId: 'user5', comment: '첫骑行完成!' },
        ]
      },
      {
        id: 'p2',
        lat: 37.5700,
        lng: 126.9750,
        name: '한강대교 남단',
        memo: '한강대교 아래에서 잠시 쉬어가는 포인트',
        creatorPhoto: 'https://picsum.photos/seed/road1_p2/400/300',
        challengerPhotos: [
          { url: 'https://picsum.photos/seed/c2_1/400/300', userId: 'user3', comment: '여기ビュー很漂亮!' },
          { url: 'https://picsum.photos/seed/c2_2/400/300', userId: 'user4', comment: '배경이 정말 예쁨' },
        ]
      },
      {
        id: 'p3',
        lat: 37.5750,
        lng: 126.9700,
        name: '반포대교 전망대',
        memo: '반포대교 아래에서 바라보는 한강이 최고!',
        creatorPhoto: 'https://picsum.photos/seed/road1_p3/400/300',
        challengerPhotos: [
          { url: 'https://picsum.photos/seed/c3_1/400/300', userId: 'user2', comment: '야경이 정말素晴らしいです!' },
          { url: 'https://picsum.photos/seed/c3_2/400/300', userId: 'user5', comment: '다음에 가족이랑 오고 싶어요' },
          { url: 'https://picsum.photos/seed/c3_3/400/300', userId: 'user4', comment: '힐링 완료!' },
        ]
      },
    ]
  },
  {
    id: 'road2',
    userId: 'user3',
    name: '남산 둘레길',
    description: '남산을 둘러싸는 산책로. 봄에 꽃이大変 예쁩니다.',
    thumbnail: 'https://picsum.photos/seed/namsan/800/400',
    geometry: {
      type: 'LineString',
      coordinates: [
        [126.9900, 37.5510],
        [126.9950, 37.5550],
        [127.0000, 37.5600],
        [127.0050, 37.5650],
      ],
    },
    distance: 8.2,
    duration: 35,
    likeCount: 95,
    commentCount: 15,
    challengeCount: 56,
    completeCount: 42,
    createdAt: '2025-04-05T14:30:00Z',
    points: [
      {
        id: 'p1',
        lat: 37.5510,
        lng: 126.9900,
        name: '남산 케이블카 승강장',
        memo: '케이블카 타고 올라가면 쉬워요!',
        creatorPhoto: 'https://picsum.photos/seed/road2_p1/400/300',
        challengerPhotos: [
          { url: 'https://picsum.photos/seed/n1_1/400/300', userId: 'user2', comment: '케이블카 타는 중~' },
        ]
      },
      {
        id: 'p2',
        lat: 37.5600,
        lng: 127.0000,
        name: 'N서울타워 앞',
        memo: '타워 앞에서 사진 찍기 최고!',
        creatorPhoto: 'https://picsum.photos/seed/road2_p2/400/300',
        challengerPhotos: [
          { url: 'https://picsum.photos/seed/n2_1/400/300', userId: 'user1', comment: '타워가 정말 높아요!' },
          { url: 'https://picsum.photos/seed/n2_2/400/300', userId: 'user4', comment: '야경도很漂亮!' },
        ]
      },
    ]
  },
  {
    id: 'road3',
    userId: 'user4',
    name: '광화문~경복궁 역사 투어',
    description: '서울의 역사를 느끼는 코스입니다.',
    thumbnail: 'https://picsum.photos/seed/gwanghwamun/800/400',
    geometry: {
      type: 'LineString',
      coordinates: [
        [126.9770, 37.5760],
        [126.9760, 37.5750],
        [126.9750, 37.5740],
        [126.9740, 37.5730],
      ],
    },
    distance: 2.5,
    duration: 20,
    likeCount: 67,
    commentCount: 8,
    challengeCount: 34,
    completeCount: 28,
    createdAt: '2025-04-10T09:00:00Z',
    points: [
      {
        id: 'p1',
        lat: 37.5760,
        lng: 126.9770,
        name: '광화문 광장',
        memo: '세종大王 동상이 있어요',
        creatorPhoto: 'https://picsum.photos/seed/road3_p1/400/300',
        challengerPhotos: [
          { url: 'https://picsum.photos/seed/g1_1/400/300', userId: 'user5', comment: '역사 여행 중' },
        ]
      },
      {
        id: 'p2',
        lat: 37.5740,
        lng: 126.9750,
        name: '경복궁 해치门',
        memo: '进去하면 역사 박물관이 있어요',
        creatorPhoto: 'https://picsum.photos/seed/road3_p2/400/300',
        challengerPhotos: [
          { url: 'https://picsum.photos/seed/g2_1/400/300', userId: 'user3', comment: '궁궐很漂亮!' },
          { url: 'https://picsum.photos/seed/g2_2/400/300', userId: 'user1', comment: '다음에 다시 오고 싶어요' },
        ]
      },
    ]
  },
  {
    id: 'road4',
    userId: 'user5',
    name: '여의도 공원一圈',
    description: '여의도 한강공원을 타고一圈 돌기!',
    thumbnail: 'https://picsum.photos/seed/yeouido/800/400',
    geometry: {
      type: 'LineString',
      coordinates: [
        [126.9200, 37.5210],
        [126.9250, 37.5250],
        [126.9300, 37.5210],
        [126.9250, 37.5170],
      ],
    },
    distance: 5.8,
    duration: 30,
    likeCount: 156,
    commentCount: 31,
    challengeCount: 112,
    completeCount: 89,
    createdAt: '2025-04-12T16:00:00Z',
    points: [
      {
        id: 'p1',
        lat: 37.5210,
        lng: 126.9200,
        name: '여의도 시민공원',
        memo: '서울証券取引所在 가까이에 있어요',
        creatorPhoto: 'https://picsum.photos/seed/road4_p1/400/300',
        challengerPhotos: [
          { url: 'https://picsum.photos/seed/y1_1/400/300', userId: 'user2', comment: '공원 러닝하기 좋아요' },
          { url: 'https://picsum.photos/seed/y1_2/400/300', userId: 'user3', comment: '자전거 타기 좋은 길!' },
        ]
      },
    ]
  },
  {
    id: 'road5',
    userId: 'user2',
    name: '뚝섬 자전거길',
    description: '뚝섬에서 성수까지 이어지는 루트',
    thumbnail: 'https://picsum.photos/seed/jamsil/800/400',
    geometry: {
      type: 'LineString',
      coordinates: [
        [127.0650, 37.5350],
        [127.0700, 37.5400],
        [127.0750, 37.5450],
        [127.0800, 37.5500],
      ],
    },
    distance: 9.3,
    duration: 40,
    likeCount: 88,
    commentCount: 12,
    challengeCount: 45,
    completeCount: 33,
    createdAt: '2025-04-15T11:30:00Z',
    points: []
  },
  {
    id: 'road6',
    userId: 'user3',
    name: '동대문 디자인 플라자',
    description: 'DDP 근처의 현대적인 도시 여행',
    thumbnail: 'https://picsum.photos/seed/ddp/800/400',
    geometry: {
      type: 'LineString',
      coordinates: [
        [127.0090, 37.5660],
        [127.0100, 37.5650],
        [127.0110, 37.5640],
        [127.0120, 37.5630],
      ],
    },
    distance: 3.2,
    duration: 25,
    likeCount: 72,
    commentCount: 19,
    challengeCount: 28,
    completeCount: 22,
    createdAt: '2025-04-18T08:00:00Z',
    points: []
  },
];

export const mockLikes = [
  { id: 'like1', roadId: 'road1', userId: 'user1', createdAt: '2025-04-02T10:00:00Z' },
  { id: 'like2', roadId: 'road2', userId: 'user1', createdAt: '2025-04-06T14:00:00Z' },
  { id: 'like3', roadId: 'road4', userId: 'user1', createdAt: '2025-04-13T09:00:00Z' },
  { id: 'like4', roadId: 'road1', userId: 'user2', createdAt: '2025-04-02T11:00:00Z' },
  { id: 'like5', roadId: 'road3', userId: 'user2', createdAt: '2025-04-11T15:00:00Z' },
];

export const mockComments = [
  { id: 'c1', roadId: 'road1', userId: 'user2', content: '정말 beautiful한 길이네요!', createdAt: '2025-04-01T12:00:00Z' },
  { id: 'c2', roadId: 'road1', userId: 'user3', content: '야경이 정말素晴らしいです!', createdAt: '2025-04-01T14:30:00Z' },
  { id: 'c3', roadId: 'road2', userId: 'user4', content: '봄에 가면 될 것 같아요~', createdAt: '2025-04-05T16:00:00Z' },
  { id: 'c4', roadId: 'road4', userId: 'user1', content: '여의도 공원 좋아요!', createdAt: '2025-04-12T18:00:00Z' },
  { id: 'c5', roadId: 'road1', userId: 'user5', content: '다음에 가볼게요!', createdAt: '2025-04-03T10:00:00Z' },
  { id: 'c6', roadId: 'road2', userId: 'user1', content: '등산하기 좋은 곳이네요', createdAt: '2025-04-06T09:00:00Z' },
];

export const mockFriends = [
  { id: 'f1', userId: 'user1', friendId: 'user2', createdAt: '2025-01-10T10:00:00Z' },
  { id: 'f2', userId: 'user1', friendId: 'user3', createdAt: '2025-02-05T14:00:00Z' },
  { id: 'f3', userId: 'user2', friendId: 'user1', createdAt: '2025-01-10T10:00:00Z' },
  { id: 'f4', userId: 'user3', friendId: 'user1', createdAt: '2025-02-05T14:00:00Z' },
  { id: 'f5', userId: 'user2', friendId: 'user4', createdAt: '2025-02-20T09:00:00Z' },
];

export const mockAchievements = [
  { id: 'a1', userId: 'user1', name: '첫 번째 도전', description: '처음으로 길 도전을 완료했습니다', earnedAt: '2025-04-10T15:00:00Z' },
  { id: 'a2', userId: 'user1', name: '한강 마스터', description: '한강 자전거길을 완료했습니다', earnedAt: '2025-04-12T12:00:00Z' },
  { id: 'a3', userId: 'user2', name: '빠르게 달리기', description: '5km 이상의 길을 완료했습니다', earnedAt: '2025-04-08T10:00:00Z' },
];

export function getUserById(userId) {
  return mockUsers.find(u => u.id === userId);
}

export function getRoadById(roadId) {
  return mockRoads.find(r => r.id === roadId);
}

export function getRoadsByUser(userId) {
  return mockRoads.filter(r => r.userId === userId);
}

export function getFriendRoads(userId) {
  const friendIds = mockFriends
    .filter(f => f.userId === userId)
    .map(f => f.friendId);
  return mockRoads.filter(r => friendIds.includes(r.userId));
}

export function isLiked(roadId, userId) {
  return mockLikes.some(l => l.roadId === roadId && l.userId === userId);
}

export function getCommentsByRoad(roadId) {
  return mockComments
    .filter(c => c.roadId === roadId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getUserAchievements(userId) {
  return mockAchievements.filter(a => a.userId === userId);
}

export function getAllChallengerPhotos(road) {
  if (!road.points) return [];
  return road.points.flatMap(p => p.challengerPhotos || []);
}