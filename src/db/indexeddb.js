const DB_NAME = 'BikeRoadDB';
const DB_VERSION = 2;
const STORE_NAME = 'roads';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

export async function saveRoad(road) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const data = {
      ...road,
      id: road.id || crypto.randomUUID(),
      createdAt: road.createdAt || new Date().toISOString(),
      points: road.points || [],
    };
    const req = store.put(data);
    req.onsuccess = () => resolve(data.id);
    req.onerror = () => reject(req.error);
  });
}

export async function getRoads() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.index('createdAt').openCursor(null, 'prev');
    const results = [];
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getRoad(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteRoad(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function addPointPhoto(roadId, pointId, photo) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(roadId);
    req.onsuccess = () => {
      const road = req.result;
      if (!road) return reject(new Error('Road not found'));

      const point = road.points?.find(p => p.id === pointId);
      if (point) {
        point.photos = point.photos || [];
        point.photos.push({
          id: crypto.randomUUID(),
          ...photo,
          createdAt: new Date().toISOString(),
        });
      }

      const updateReq = store.put(road);
      updateReq.onsuccess = () => resolve();
      updateReq.onerror = () => reject(updateReq.error);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addPointStory(roadId, pointId, story) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(roadId);
    req.onsuccess = () => {
      const road = req.result;
      if (!road) return reject(new Error('Road not found'));

      const point = road.points?.find(p => p.id === pointId);
      if (point) {
        point.stories = point.stories || [];
        point.stories.push({
          id: crypto.randomUUID(),
          ...story,
          createdAt: new Date().toISOString(),
        });
      }

      const updateReq = store.put(road);
      updateReq.onsuccess = () => resolve();
      updateReq.onerror = () => reject(updateReq.error);
    };
    req.onerror = () => reject(req.error);
  });
}