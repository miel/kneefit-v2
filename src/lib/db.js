import { openDB } from 'idb';

let dbPromise;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB('kneefitDB', 1, {
      upgrade(db) {
        const logs = db.createObjectStore('exerciseLogs', { keyPath: 'id' });
        logs.createIndex('by-date', 'date');

        const pain = db.createObjectStore('painAssessments', { keyPath: 'id' });
        pain.createIndex('by-date', 'date');

        db.createObjectStore('customExercises', { keyPath: 'name' });
      }
    });
  }
  return dbPromise;
}

// exerciseLogs

export async function getLogs() {
  const db = await getDB();
  const all = await db.getAll('exerciseLogs');
  return all.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addLog(log) {
  const db = await getDB();
  await db.put('exerciseLogs', log);
  return log;
}

export async function updateLog(log) {
  const db = await getDB();
  await db.put('exerciseLogs', log);
}

export async function deleteLog(id) {
  const db = await getDB();
  await db.delete('exerciseLogs', id);
}

export async function bulkImportLogs(logs) {
  const db = await getDB();
  const tx = db.transaction('exerciseLogs', 'readwrite');
  await Promise.all([...logs.map(l => tx.store.put(l)), tx.done]);
}

// painAssessments

export async function getPainAssessments() {
  const db = await getDB();
  const all = await db.getAll('painAssessments');
  return all.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addPainAssessment(assessment) {
  const db = await getDB();
  await db.put('painAssessments', assessment);
  return assessment;
}

export async function deletePainAssessment(id) {
  const db = await getDB();
  await db.delete('painAssessments', id);
}

export async function bulkImportPainAssessments(assessments) {
  const db = await getDB();
  const tx = db.transaction('painAssessments', 'readwrite');
  await Promise.all([...assessments.map(a => tx.store.put(a)), tx.done]);
}

// customExercises

export async function getCustomExercises() {
  const db = await getDB();
  const all = await db.getAll('customExercises');
  return all.map(e => e.name).sort();
}

export async function addCustomExercise(name) {
  const db = await getDB();
  const existing = await db.get('customExercises', name);
  if (existing) return;
  await db.put('customExercises', { name, createdAt: Date.now() });
}

export async function deleteCustomExercise(name) {
  const db = await getDB();
  await db.delete('customExercises', name);
}
