// IndexedDB helper for saving large form or hostel data
const DB_NAME = "JacDtuHelperDB";
const STORE_NAME = "data";

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = e => {
      const db = e.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveData(id, data) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put({ id, ...data });
  await tx.done;
}

export async function getData(id) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const result = await tx.objectStore(STORE_NAME).get(id);
  return result;
}
