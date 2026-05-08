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
    thumbnail: 'https://picsum.photos/seed/hanriver/400/300',
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
  },
  {
    id: 'road2',
    userId: 'user3',
    name: '남산 둘레길',
    description: '남산을 둘러싸는 산책로. 봄에 꽃이大変 예쁩니다.',
    thumbnail: 'https://picsum.photos/seed/namsan/400/300',
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
  },
  {
    id: 'road3',
    userId: 'user4',
    name: '광화문~경복궁 역사 투어',
    description: '서울의 역사를 느끼는 코스입니다.',
    thumbnail: 'https://picsum.photos/seed/gwanghwamun/400/300',
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
  },
  {
    id: 'road4',
    userId: 'user5',
    name: '여의도 공원一圈',
    description: '여의도 한강공원을 타고一圈 돌기!',
    thumbnail: 'https://picsum.photos/seed/yeouido/400/300',
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
  },
  {
    id: 'road5',
    userId: 'user2',
    name: '뚝섬 자전거길',
    description: '뚝섬에서 성수까지 이어지는 루트',
    thumbnail: 'https://picsum.photos/seed/jamsil/400/300',
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
  },
  {
    id: 'road6',
    userId: 'user3',
    name: '동대문 디자인 플라자',
    description: 'DDP 근처의 현대적인 도시 여행',
    thumbnail: 'https://picsum.photos/seed/ddp/400/300',
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